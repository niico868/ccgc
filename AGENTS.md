# Architecture
- Export an awaited configuration object from vite.config.ts using the CLI command/mode; the preview wrapper merges objects and otherwise drops the async factory's TanStack entry plugins.
- Keep date, cutoff and weekly rotation calculations in shared pure library helpers used by ordering UI and server validation; this prevents divergent availability rules.
- Persist the selected fulfillment date alongside basket lines; meal availability derives from that date, not the browser's week.
- Enforce availability on order insertion in the database as well as the server function; direct RPC calls must not bypass menu restrictions.
- Use Embla for swipeable product photos and home slideshows; it provides reliable touch interaction without custom swipe physics.
- Derive the public square favicon from the existing brand logo and declare it in the root head; Google search icons need a stable crawlable icon URL.
- Use shared private-page metadata for account, order and administrator screens; keep searchable food content separate from non-indexed customer flows.