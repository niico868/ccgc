import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/types";

export type SubmitOrderItem = {
  itemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  category: "salad" | "meal" | "juice";
  protein?: string;
  size?: string;
  seafood?: boolean;
  preferences?: string;
  notes?: string;
};

export type SubmitOrderInput = {
  idempotencyKey: string;
  bearer?: string | null;
  customerName: string;
  phone: string;
  email?: string;
  fulfillment: "Delivery" | "Pickup";
  pickupLocation?: string;
  deliveryAddress?: string;
  deliveryZone?: string;
  fulfillmentWindow?: string;
  requiredFulfillmentDate?: string; // YYYY-MM-DD
  splitForFreshness?: boolean;
  /** "none" | "weekly" | "monthly" — a request to repeat, not a charge. */
  recurringFrequency?: string;
  paymentMethod: string;
  notes?: string;
  allergyInfo?: string;
  dropOffInstructions?: string;
  items: SubmitOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountCode?: string | null;
  discountAmount: number;
  total: number;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((data: SubmitOrderInput) => {
    if (!data || typeof data !== "object") throw new Error("Invalid payload");
    if (!UUID_RE.test(String(data.idempotencyKey ?? ""))) throw new Error("Invalid idempotency key");
    if (!data.customerName?.trim()) throw new Error("Name is required");
    if (!data.phone?.trim()) throw new Error("Phone number is required");
    if (data.fulfillment !== "Delivery" && data.fulfillment !== "Pickup") throw new Error("Invalid fulfillment");
    if (data.fulfillment === "Delivery" && !data.deliveryAddress?.trim()) throw new Error("Delivery address is required");
    if (!Array.isArray(data.items) || data.items.length === 0) throw new Error("Basket is empty");
    let food = 0, drink = 0;
    for (const it of data.items) {
      const qty = Number(it.quantity) || 0;
      if (qty < 1) throw new Error("Invalid item quantity");
      if (it.category === "salad" || it.category === "meal") food += qty;
      else if (it.category === "juice") drink += qty;
    }
    if (food > 0 && food < 5) throw new Error(`Food minimum not met: 5 required, ${food} provided`);
    if (drink > 0 && drink < 6) throw new Error(`Drink minimum not met: 6 required, ${drink} provided`);
    if (food === 0 && drink === 0) throw new Error("Basket has no valid items");
    return data;
  })
  .handler(async ({ data }) => {
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          if (data.bearer) h.set("Authorization", `Bearer ${data.bearer}`);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const payload = {
      customer_name: data.customerName,
      phone: data.phone,
      email: data.email ?? "",
      fulfillment: data.fulfillment,
      pickup_location: data.pickupLocation ?? "",
      delivery_address: data.deliveryAddress ?? "",
      delivery_zone: data.deliveryZone ?? "",
      fulfillment_window: data.fulfillmentWindow ?? "",
      required_fulfillment_date: data.requiredFulfillmentDate ?? "",
      split_for_freshness: data.splitForFreshness ?? false,
      recurring_frequency: data.recurringFrequency ?? "none",
      payment_method: data.paymentMethod,
      notes: data.notes ?? "",
      allergy_info: data.allergyInfo ?? "",
      drop_off_instructions: data.dropOffInstructions ?? "",
      items: data.items as unknown as Json,
      subtotal: data.subtotal,
      delivery_fee: data.deliveryFee,
      discount_code: data.discountCode ?? "",
      discount_amount: data.discountAmount,
      total: data.total,
    };

    const { data: rows, error } = await client.rpc("submit_order", {
      _payload: payload as unknown as Json,
      _idem: data.idempotencyKey,
    });
    if (error) {
      throw new Error(error.message || "Order submission failed");
    }
    const row = Array.isArray(rows) ? rows[0] : rows;
    const ref = (row as { order_ref?: string } | null)?.order_ref;
    if (!ref) throw new Error("Order submission failed");
    return { orderRef: ref, isNew: Boolean((row as { is_new?: boolean } | null)?.is_new) };
  });
