## 1. Branding & visuals
- Replace `src/assets/hero-salad.jpg` with the uploaded grilled-chicken broccoli bowl photo and use it as the homepage hero.
- Replace `src/assets/logo.png` with the uploaded "Fine Time for Cathy's — Clean, Green, Classics" circular logo. Used in header, footer watermark, and promo popup.
- Footer: change "Fine Time for Cathy's" and the tagline "Clean Green Classics — fresh homemade food from Trinidad & Tobago." to **Great Vibes** font (`font-script`).

## 2. Pricing updates (`src/lib/menu-data.ts`)
- Salads base: **$40** (was $45).
- Healthy Meals base: **$45** (was $65).
- Seafood (Fish/Shrimp) still adds **+$5**.
- Update homepage Meal Plan prices accordingly: 5 × $45 = **$225**, 8 = **$360**, 12 = **$540** (only shown on cards; the Meal Prep page itself is being removed — see §5).

## 3. WhatsApp fixes
- Standalone "Order on WhatsApp" buttons currently 404 / API-fail. Fix `WhatsAppButton` and all `waLink()` callers to open `https://wa.me/18684884248?text=...` in a new tab (`target="_blank" rel="noopener noreferrer"`). Verify no relative path is generated.
- Checkout "Confirm Order" button: currently fails to open WhatsApp on first click. Fix by:
  - Building the `wa.me` URL **synchronously** during the click handler (no async/await before `window.open`) so the popup isn't blocked.
  - Use `window.open(url, "_blank", "noopener")` and fall back to `location.href = url` if it returns null.
  - Also clear the basket **after** the open call, not before.

## 4. Cutoff & fulfillment rule changes
- New rule: orders close the **day before** the fulfillment day (no same-day orders). Any order placed on day X applies to the next fulfillment day.
- Delivery starts at **2 PM**.
- Update everywhere this is shown: homepage notice bar, `OrderRules`, `OrderingAccordion`, FAQ, checkout copy.
- FAQ: rewrite cutoff/ordering Q&As to match (remove "9 AM same-day"); add new Q&As: "When do I need to order by?", "When does delivery start?", "Can I order for the same day?".

## 5. Remove Meal Prep page
- Delete `src/routes/meal-prep.tsx` and `src/routes/meal-plan-selection.tsx`.
- Regenerate route tree (remove entries).
- Remove "Meal Prep Plans" from header nav and footer "Order" list.
- Homepage: remove the Meal Prep section and "View All Plans" button. Meal-plan ordering happens through the normal Salads/Meals flow with quantity (min 5).
- Replace any "View Plan" CTA with "Order Meals".

## 6. Pickup location copy
- Footer + Contact: change pickup list to:
  - **St Clair:** 11 AM – 1 PM
  - **Orange Grove, Tacarigua:** 2 PM – 6 PM
  - (remove the third "Pickup 2" line and remove "Trincity")

## 7. Contact page heading
- Change `Contact — Let's talk fresh food.` to **`Let's Chat`**.

## 8. Auth & accounts (Lovable Cloud)
Enable Lovable Cloud. Configure providers: email/password + Google (via `supabase--configure_social_auth`).

**Schema (migration):**
- `profiles` table — `id uuid PK references auth.users(id) on delete cascade`, `first_name`, `last_name`, `email`, `phone`, `marketing_opt_in bool`, timestamps. RLS: user reads/updates own row. Trigger on `auth.users` insert to seed a profile from signup metadata.
- `orders` table — `id`, `user_id references auth.users`, `total_cents int`, `items jsonb`, `status text default 'submitted'`, `whatsapp_sent_at`, `created_at`. RLS: user selects/inserts own rows. Grants for `authenticated` + `service_role`.
- `discount_codes` table — `id`, `user_id`, `code text`, `percent int`, `source text` (e.g. `signup_popup`), `redeemed_at`, `created_at`. RLS: user selects own; insert via server fn.

**UI:**
- **Account icon** next to the basket in `Header.tsx`. Logged-out: dropdown with "Sign in" / "Create account". Logged-in: dropdown with "My account", "Order history", "Saved discounts", "Sign out".
- **`/auth` route** — single page with tabs: Sign in / Sign up. Both surfaces show "Continue with Google" and email/password form with "Stay signed in" checkbox (controls Supabase session persistence). Sign-up form matches the attached screenshot layout: First Name, Last Name, Email, Phone, marketing opt-in checkbox, Password, Confirm Password, Continue button.
- **On-load sign-in prompt** — soft modal (once per device via localStorage flag) inviting visitors to sign in / sign up, dismissible. Does not block browsing.
- **`/account`** (under `_authenticated` layout) — profile details, order history list (reads from `orders`), saved discount codes list.
- **Checkout integration** — if not signed in, the checkout form doubles as account creation: collects name/email/phone/password + confirm; on submit, creates the auth user (with `emailRedirectTo: window.location.origin`) and writes the profile, then submits the order. If already signed in, autofills from profile.
- **Order persistence** — when "Confirm Order" runs, insert an `orders` row via a `createServerFn` (`requireSupabaseAuth`) before opening WhatsApp; show in `/account` order history.
- **Discount popup** — existing `PromoPopup` becomes the signup discount flow. On submit, if signed in, server fn generates a unique code (e.g. `WELCOME-XXXX`, 10% off) and inserts into `discount_codes`; if signed out, it routes the user to `/auth` and creates the code after first sign-in. Code displays in popup and is saved in account.

## 9. Red-text discipline (carry-over rule)
Keep all informational notes brown (`text-brown`). Red only for cutoff misses, missing minimums, or auth errors.

---

### Technical notes
- New files: `src/routes/auth.tsx`, `src/routes/_authenticated.tsx`, `src/routes/_authenticated/account.tsx`, `src/components/site/AccountMenu.tsx`, `src/components/site/SignInPromptModal.tsx`, `src/lib/orders.functions.ts`, `src/lib/discount.functions.ts`, Supabase migration for `profiles`/`orders`/`discount_codes` + grants + RLS + signup trigger.
- Wire `attachSupabaseAuth` in `src/start.ts` (per Supabase integration knowledge) and add a root `onAuthStateChange` listener to invalidate router/query caches.
- Use the Lovable broker for Google sign-in (`lovable.auth.signInWithOAuth("google", ...)`) and call `supabase--configure_social_auth` with `providers: ["google"]`.
- Validate signup/profile inputs with Zod (name ≤100, email, phone format, password ≥8).
- Delete `src/assets/section-mealprep.jpg` after meal-prep page removal.
