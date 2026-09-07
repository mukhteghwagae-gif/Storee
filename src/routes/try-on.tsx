import { createFileRoute } from "@tanstack/react-router";
import { AtelierStudio } from "@/components/ar/studio";

type Search = { piece?: string };

export const Route = createFileRoute("/try-on")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    piece: typeof s.piece === "string" ? s.piece : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Atelier Mirror — Sitara" },
      {
        name: "description",
        content:
          "Sitara’s virtual try-on. Live landmark tracking places hallmarked gold on your ears, neck, and hands. Nothing is uploaded.",
      },
    ],
  }),
  component: TryOn,
});

function TryOn() {
  const { piece } = Route.useSearch();
  return (
    <main>
      <AtelierStudio initialSlug={piece} />
    </main>
  );
}
