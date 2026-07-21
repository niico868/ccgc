## Goal
Give customers without WhatsApp a live-updated way to see their order status, and give you (admin) an easy way to update that status.

## Customer side

**New route `/order/$orderRef`** — a public order-status page.
- Customer enters (or is deep-linked with) their order ID (e.g. `CGCC-XYZ`) + last 4 digits of phone as a lightweight check.
- Shows: items, subtotal, delivery fee, discount, total, fulfillment method, pickup/delivery info, and a big **status badge**.
- Status timeline: `Received → Confirmed → Prepping → Ready → Out for delivery / Ready for pickup → Completed` (with `Cancelled` as a side state).
- Live updates via Supabase Realtime on the `orders` row — status changes appear instantly, no refresh.
- Simple "Look up my order" page at `/order` for anyone with just the ID.

**Checkout confirmation screen update**
- After submitting, show the order ID prominently plus a "Track your order" button linking to `/order/{ref}`.
- Add a note: "No WhatsApp? Bookmark this link to see live updates."
- If the customer entered an email, we'll (later) also email the link — for now just display + copy button.

## Admin side

**New tab in `/admin` → "Orders"**
- Table of recent orders (ref, name, phone, total, status, created).
- Inline status dropdown per row — one click updates status in DB.
- Optional internal note field.
- Filter by status, search by ref/phone/name.

## Data changes

Add to `orders` table:
- `status text not null default 'received'` (check constraint on allowed values)
- `status_updated_at timestamptz`
- `admin_note text`

New RLS policy: allow **public SELECT** on a narrow view (or on `orders` filtered by `order_ref` + last-4-of-phone match) so unauthenticated customers can read their own order status without login. Admin update policy already governed by `has_role`.

Enable Realtime on `public.orders`.

## Technical notes
- Public lookup uses a SECURITY DEFINER RPC `get_order_status(ref text, phone_last4 text)` returning only the safe fields — avoids exposing the whole table to `anon`.
- Realtime subscription in `/order/$orderRef` scoped to that one row.
- Status enum kept as text with check constraint for easy future changes.

## Out of scope (for this pass)
- Email/SMS notifications on status change (can add later once you set up email domain).
- WhatsApp automation (deferred as you noted).

## Questions before I build
1. Confirm the status stages above — add/remove any?
2. OK with the "order ID + last 4 of phone" lookup, or would you prefer requiring a login (only works for customers who created an account)?
