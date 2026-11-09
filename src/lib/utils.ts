import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * srcSet for a menu photo: every /images/*.webp food photo also has a 640px-wide
 * "-640.webp" copy, so phones download the small one.
 */
export function photoSrcSet(url: string) {
  if (!url.startsWith("/images/") || !url.endsWith(".webp")) return undefined;
  return `${url.replace(/\.webp$/, "-640.webp")} 640w, ${url} 1000w`;
}
