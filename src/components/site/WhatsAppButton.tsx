import wa from "@/assets/whatsapp.png";

export function WhatsAppButton({
  href,
  children = "WhatsApp",
  size = "md",
  className = "",
}: {
  href: string;
  children?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}) {
  const h = size === "sm" ? "h-10 px-4 text-xs" : "h-11 px-5 text-sm";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-full bg-wa font-semibold text-cream shadow-card transition hover:brightness-105 ${h} ${className}`}
    >
      <img src={wa} alt="" className="h-5 w-5" />
      <span>{children}</span>
    </a>
  );
}
