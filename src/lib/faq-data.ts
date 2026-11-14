import { parseFaq } from "./brain";
import { brainFile } from "./brain-files";

/** FAQ answers, edited in src/brain/faq.md. Shared by the FAQ page and the website assistant. */
export const FAQ_ITEMS: { q: string; a: string }[] = parseFaq(brainFile("faq"));
