export function MinimumNotice({ kind }: { kind: "food" | "drink" }) {
  const text =
    kind === "food"
      ? "Minimum 5 meals per order. Seafood adds $5 per meal."
      : "Minimum 6 drinks per order.";
  return (
    <div className="rounded-2xl border border-leaf-soft/40 bg-leaf-soft/10 px-5 py-3 text-center text-sm font-semibold text-leaf-deep">
      {text}
    </div>
  );
}
