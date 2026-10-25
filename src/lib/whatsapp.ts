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

/* ─────────────────────── Phone number handling ─────────────────────── */

export const PHONE_HELP =
  "WhatsApp / phone number – just the 7 digits, no 868, no dashes (e.g. 4884248). Outside Trinidad & Tobago? Start with + and your country code.";

export const PHONE_ERROR =
  "Please enter a valid number so we can confirm your order – 7 digits, no area code or dashes (e.g. 4884248). For a foreign number, start with + and your country code.";

const LOCAL_FIRST_DIGITS = new Set(["2", "3", "4", "6", "7"]);
const FAKE_LOCAL = new Set(["0000000", "1111111", "1234567", "7654321", "9999999"]);

function validLocal(seven: string): boolean {
  return (
    /^\d{7}$/.test(seven) &&
    LOCAL_FIRST_DIGITS.has(seven[0] ?? "") &&
    !FAKE_LOCAL.has(seven) &&
    !/^(\d)\1{6}$/.test(seven)
  );
}

/**
 * Normalize a customer phone number to a consistent international format:
 *   local Trinidad & Tobago → "+1868XXXXXXX"
 *   foreign                 → "+<country code and number>"
 * Returns null when the input cannot be a real contact number.
 *
 * Forgiving on input: spaces, dashes and brackets are stripped, and a
 * local number typed with an 868 or 1868 prefix is accepted.
 */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const hadPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;

  if (hadPlus) {
    // "+1868…" is treated as a local T&T number, not foreign.
    if (digits.startsWith("1868")) {
      const seven = digits.slice(4);
      return validLocal(seven) ? `+1868${seven}` : null;
    }
    // Foreign: country code + number, 8 to 15 digits total.
    if (digits.length >= 8 && digits.length <= 15) return `+${digits}`;
    return null;
  }

  // No plus: local T&T number, possibly with an 868 / 1868 prefix.
  let seven: string | null = null;
  if (digits.length === 7) seven = digits;
  else if (digits.length === 10 && digits.startsWith("868")) seven = digits.slice(3);
  else if (digits.length === 11 && digits.startsWith("1868")) seven = digits.slice(4);
  if (seven && validLocal(seven)) return `+1868${seven}`;
  return null;
}

/** Digits suitable for a wa.me link, or null when the number is unusable. */
export function customerWaNumber(phone: string | null | undefined): string | null {
  const normalized = normalizePhone(phone);
  return normalized ? normalized.slice(1) : null;
}

/** WhatsApp chat link to a customer, or null when their number is invalid. */
export function customerWaLink(phone: string | null | undefined, text: string): string | null {
  const number = customerWaNumber(phone);
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(text)}` : null;
}
