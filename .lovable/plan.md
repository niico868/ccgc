
## Goals

Clean up routing errors, remove the unfinished Build Your Own Salad flow, fix the broken "View Meal Plan" button, and tighten all product pages for direct ordering.

## 1. Remove Build Your Own Salad flow

In `src/routes/salads.tsx`:
- Delete the entire "Build Your Own Salad" section (the citrus-gradient card with `SALAD_INGREDIENTS` and the "Build My Salad (request)" button that currently links to `/catering`).
- Remove the `Sparkles` icon import and `SALAD_INGREDIENTS` import if no longer used.
- Keep specialty salads grid, WhatsApp button, first-timer card, order rules, and other-sections intact.

No nav entry exists for Build Your Own Salad, so no Header change needed. Leave `SALAD_INGREDIENTS` data in `menu-data.ts` for future use.

## 2. Meal Plan placeholder page + fix View Meal Plan button

Create new route `src/routes/meal-plan-selection.tsx`:
- Simple centered page: heading "Meal Plan Selection Coming Soon", subtext "Choose from 5, 8, or 12 meal plans. Full meal selection and customization will be available soon."
- Single CTA button back to `/meal-prep`.
- Uses existing Section component, brand styling, no hero image.

In `src/routes/meal-prep.tsx`:
- Change the "View Meal Plan" `<Link to="/contact">` to `<Link to="/meal-plan-selection">`.
- Remove the `PageHero` block (large image) and replace with a compact page header (eyebrow + title + 1-line intro, no image).
- Change the bottom seafood notice from `text-tomato`/`border-tomato`/`bg-tomato/10` to brown tones (use `--clay`/brown token; if not present, add a `--brown` token in `styles.css` like `oklch(0.42 0.07 55)` and a corresponding `bg-brown/10`, `border-brown/30`, `text-brown` utility approach via inline `text-[color]` or new tailwind-safe class).

## 3. Compact product pages (Salads, Meals, Juices, Meal Prep)

For each of `salads.tsx`, `meals.tsx`, `juices.tsx`, `meal-prep.tsx`:
- Remove `PageHero` (large hero image + long intro paragraph).
- Replace with a compact header section: small eyebrow, H1 title, optional 1-line subtitle. No image. Tight top padding.
- Remove unused `hero` image imports.

For Salads page specifically:
- Convert the "Important salad ordering info" panel from always-visible to a collapsible accordion (closed by default). Use existing `@/components/ui/accordion` (shadcn). Title: "How ordering works". Keep the same 6 info lines inside.
- Recolor that panel's accent from tomato/red to brown (it's informational, not an alert).

For Meals and Juices pages:
- Wrap the `<OrderRules />` block in the same accordion ("How ordering works", closed by default).

Inspect `OrderRules.tsx` first to confirm whether it has its own red accents; if so, retune to brown for normal info, keeping red only for the 8 AM cutoff line (genuine deadline).

## 4. Site-wide red → brown for informational text

Audit and recolor non-alert red usage:
- `meal-prep.tsx` seafood note → brown.
- Salads page ordering-info card → brown accent (was leaf-deep + tomato eyebrow; change eyebrow from `text-tomato` to brown).
- Any `text-tomato`/`border-tomato`/`bg-tomato/*` used for generic info notes across product pages → brown.
- Keep red (`tomato`) only for: order cutoff times ("Order by 8 AM"), basket count badge, true warnings.

Add a brown token to `src/styles.css` if one doesn't already exist (`--brown` ~ warm chocolate) and expose via `@theme` so `text-brown`, `bg-brown`, `border-brown` work in Tailwind v4.

## 5. Verify

After edits:
- `rg "to=\"/catering\"|to=\"/contact\"" src/routes/salads.tsx src/routes/meal-prep.tsx` to confirm no stray wrong links.
- `rg "SALAD_INGREDIENTS|Build My Salad|Build Your Own Salad" src/` to confirm removal from user-facing pages.
- Check `routeTree.gen.ts` regenerates with `/meal-plan-selection`.
- Visual check of each product page in preview.

## Out of scope (deferred per user)

- Real Build Your Own Salad ordering page.
- Real meal-plan selection/ordering flow.
- Admin dashboard / Lovable Cloud wiring.
