import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildLlmsFullTxt } from "@/lib/llms";

export const Route = createFileRoute("/llms-full.txt")({
  server: {
    handlers: {
      GET: async () =>
        new Response(buildLlmsFullTxt(), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
