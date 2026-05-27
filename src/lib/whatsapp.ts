export const WHATSAPP_NUMBER = "18684884248";

export function waLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Open WhatsApp synchronously from inside a click handler so the popup
 * blocker doesn't kill the new tab. Always do this BEFORE any async work.
 */
export function openWhatsApp(text: string) {
  const url = waLink(text);
  const win = typeof window !== "undefined" ? window.open(url, "_blank", "noopener,noreferrer") : null;
  if (!win && typeof window !== "undefined") {
    // Popup blocked — fall back to same-tab navigation.
    window.location.href = url;
  }
  return url;
}
