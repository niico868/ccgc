import { parseBrain } from "./brain";

/** Every markdown file in src/brain, bundled at build time. Add a file and it is picked up. */
const files = import.meta.glob("../brain/*.md", { query: "?raw", import: "default", eager: true }) as Record<
  string,
  string
>;

export const BRAIN = parseBrain(files);

export function brainFile(name: string) {
  const file = BRAIN.find((f) => f.name === name);
  if (!file) throw new Error(`Missing brain file src/brain/${name}.md`);
  return file;
}
