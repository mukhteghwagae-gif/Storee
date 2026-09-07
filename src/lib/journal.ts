export type Article = {
  slug: string;
  title: string;
  dek: string;
  category: "bridal" | "care" | "looks" | "craft";
  date: string;
  readMin: number;
  image: string;
  body: string[];
};

export const ARTICLES: Article[] = [
  {
    slug: "bridal-couture-week-lahore",
    title: "What the brides actually wore at Couture Week",
    dek: "Away from the ramp: closed chokers, a single tikka, and the return of quiet gold.",
    category: "bridal",
    date: "2026-08-18",
    readMin: 6,
    image: "/editorial/bridal.jpg",
    body: [
      "The loudest jewellery on the ramp was not what left the building. In the front rows and the after-parties, Lahore’s brides chose closed kundan chokers, a maang tikka worn slightly off-centre, and bangles that could survive a mehndi without a jeweller on speed-dial.",
      "Sitara’s Noor Jahan set was built for this mood: heirloom density, modern sit. A haar should not require a neck like a column. Ours is cut so the weight lives on the collarbone, not the spine.",
      "If you are collecting a trousseau this season, buy the tikka first. It photographs. It packs. It is the piece daughters steal.",
    ],
  },
  {
    slug: "how-to-clean-silver-at-home",
    title: "How to clean silver at home (without ruining it)",
    dek: "Baking soda is not a personality. Here is the method our bench actually uses.",
    category: "care",
    date: "2026-07-02",
    readMin: 4,
    image: "/editorial/clean.jpg",
    body: [
      "Oxidized silver is meant to be dark in the recesses. If you boil it in foil and soda, you erase the work. Sitara’s moonlight pieces should be wiped with a microfibre cloth, then a drop of mild soap, then dried like you mean it.",
      "For 925 that has gone grey on the high points only: a silver cloth, straight strokes, no circles. Never toothpaste. Never lemon on stones.",
      "Gold, by contrast, likes warmth. A bowl of lukewarm water, a drop of dish soap, a soft brush along the gallery. Rinse. Pat. A jeweller’s cloth once a month.",
    ],
  },
  {
    slug: "office-gold-the-three-piece-rule",
    title: "The three-piece rule for office gold",
    dek: "Studs, a chain, a knife-edge ring. Anything else is a meeting.",
    category: "looks",
    date: "2026-06-11",
    readMin: 3,
    image: "/editorial/lookbook.jpg",
    body: [
      "Pakistani offices still read jewellery as character. Too little looks unfinished; too much looks like you are leaving at four for a walima. The edit that works: Pearl Luna studs, the Thread of Light, one Dawn stacking ring.",
      "Hoops if the day includes dinner. A bangle if it includes your mother.",
      "Save emeralds for the evenings you intend to remember.",
    ],
  },
  {
    slug: "inside-the-lahore-bench",
    title: "Inside the bench: how a 22k ring is still made",
    dek: "Wax, fire, files, and a man who has been chasing a seam since 1987.",
    category: "craft",
    date: "2026-05-09",
    readMin: 7,
    image: "/editorial/craft.jpg",
    body: [
      "Sitara does not own a factory. We own a bench, and the bench owns us. Gold arrives as a grain, becomes a wire, becomes a gallery. The emerald is not glued. It is bedded.",
      "Hallmarking is not a sticker. Every 22k piece over 2 grams leaves with a Karatstamp and a Sitara maker’s mark. If a piece cannot be marked, we do not call it gold.",
      "You can visit. Tuesdays, by appointment, in the old city light.",
    ],
  },
  {
    slug: "stacking-without-looking-busy",
    title: "Stacking without looking busy",
    dek: "Three rings, one story. The rest is noise.",
    category: "looks",
    date: "2026-04-22",
    readMin: 4,
    image: "/editorial/hand-stack.jpg",
    body: [
      "A stack is a sentence. Knife-edge, baguette, knife-edge. Or gold, gold, a single silver solitaire as a comma. Do not mix four textures unless you are on a campaign.",
      "Our configurator exists because the hand is not a moodboard. Build on a real silhouette, then add the stack at a bundle price — we take ten percent off three.",
    ],
  },
  {
    slug: "celebrity-looks-we-would-actually-wear",
    title: "Celebrity looks we would actually wear",
    dek: "Not the red carpet. The airport, the dholki, the Tuesday.",
    category: "looks",
    date: "2026-03-30",
    readMin: 5,
    image: "/editorial/everyday.jpg",
    body: [
      "Mahira’s small hoops in a white shirt did more for 22k than any award-show haar. Mawra’s pearl studs at a morning show. A single kangan on an otherwise bare wrist in a black sari.",
      "Copy the scale, not the costume. Sitara will not sell you a replica of a film set. We will sell you the piece that made the still worth keeping.",
    ],
  },
];

export const ARTICLE_BY_SLUG = Object.fromEntries(ARTICLES.map((a) => [a.slug, a])) as Record<
  string,
  Article
>;

export const ARTICLE_CATEGORY: Record<Article["category"], string> = {
  bridal: "Bridal Couture Week",
  care: "Care",
  looks: "Looks",
  craft: "Craft",
};
