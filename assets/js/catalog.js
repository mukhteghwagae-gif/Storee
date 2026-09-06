/* ==========================================================================
   SITARA — catalogue and content
   Single source of truth. The storefront reads it in the browser; the database
   seed (server/db/seed.js) requires the same file in Node; the search index and
   the finder quiz are built from it at runtime.

   Prices are PKR and tax inclusive. Weights are grams. Making charges are the
   fixed figure printed on the invoice — never a percentage of the metal.
   ========================================================================== */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CATALOG = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const products = [
    {
      "id": 1,
      "slug": "noor-jahan",
      "name": "Noor Jahan Bridal Set",
      "urdu": "نور جہاں",
      "subtitle": "22k hallmarked gold, 86.4 g",
      "collection": "bridal-couture",
      "category": "necklace",
      "metal": "gold",
      "karat": "22k",
      "gemstone": "polki",
      "occasion": [
        "bridal"
      ],
      "price": 1850000,
      "compareAt": null,
      "weightG": 86.4,
      "makingPkr": 125000,
      "hallmarked": true,
      "antiTarnish": true,
      "images": [
      "assets/img/products/noor-jahan.webp",
      "assets/img/products/noor-jahan-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/noor-jahan.webp",
      "assets/img/products/thumb/noor-jahan-2.webp"
    ],
      "hover": "assets/img/products/noor-jahan-2.webp",
      "overlay": null,
      "description": "A full bridal haar in 22k yellow gold, set with uncut polki and a hush of emerald silk-tone beads. Named for the empress who commissioned light itself. Each plaque is hand-cut in our Lahore atelier, then strung so the necklace sits close to the collarbone — a choker that becomes a story.",
      "details": [
        "22k hallmarked gold, 86.4 g",
        "Uncut polki diamonds, emerald-tone beads",
        "Necklace, earrings and matching jhumka drops",
        "Adjustable silk-cord back",
        "Presented in a Sitara cedar box"
      ],
      "care": "Warm water, a drop of mild soap, a soft brush along the gallery. Rinse, pat dry, and a jeweller's cloth once a month. Bring it to the bench once a year and we re-polish it at no charge.",
      "look": [
        "sitara-tikka",
        "pair-kangan",
        "lahore-jhumkas"
      ],
      "stackable": false,
      "tryOn": null,
      "featured": true,
      "newest": true,
      "bestSeller": true,
      "stock": 2,
      "sizeType": "none",
      "rating": 4.8,
      "reviews": 6,
      "tags": [
        "necklace",
        "haar",
        "locket",
        "pendant",
        "choker",
        "gold",
        "polki",
        "22k"
      ]
    },
    {
      "id": 2,
      "slug": "mughal-choker",
      "name": "Mughal Empress Choker",
      "urdu": "",
      "subtitle": "22k hallmarked gold, 42.8 g",
      "collection": "bridal-couture",
      "category": "necklace",
      "metal": "gold",
      "karat": "22k",
      "gemstone": "kundan",
      "occasion": [
        "bridal",
        "party"
      ],
      "price": 980000,
      "compareAt": null,
      "weightG": 42.8,
      "makingPkr": 78000,
      "hallmarked": true,
      "antiTarnish": true,
      "images": [
      "assets/img/products/mughal-choker.webp",
      "assets/img/products/mughal-choker-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/mughal-choker.webp",
      "assets/img/products/thumb/mughal-choker-2.webp"
    ],
      "hover": "assets/img/products/mughal-choker-2.webp",
      "overlay": null,
      "description": "A closed kundan choker in the old Lahore manner — uncut stones bedded in gold foil, emerald beads at the drop. Meant to be worn with an open-necked peshwas or a modern silk shirt; it does not require a stage.",
      "details": [
        "22k hallmarked gold, 42.8 g",
        "Kundan and polki setting",
        "Hidden box clasp"
      ],
      "care": "Warm water, a drop of mild soap, a soft brush along the gallery. Rinse, pat dry, and a jeweller's cloth once a month. Bring it to the bench once a year and we re-polish it at no charge.",
      "look": [
        "sitara-tikka",
        "sultan-ring",
        "lahore-jhumkas"
      ],
      "stackable": false,
      "tryOn": null,
      "featured": true,
      "newest": false,
      "bestSeller": false,
      "stock": 3,
      "sizeType": "none",
      "rating": 5,
      "reviews": 6,
      "tags": [
        "necklace",
        "haar",
        "locket",
        "pendant",
        "choker",
        "gold",
        "kundan",
        "22k"
      ]
    },
    {
      "id": 3,
      "slug": "sitara-tikka",
      "name": "Sitara Maang Tikka",
      "urdu": "",
      "subtitle": "22k hallmarked gold, 11.2 g",
      "collection": "bridal-couture",
      "category": "tikka",
      "metal": "gold",
      "karat": "22k",
      "gemstone": "emerald",
      "occasion": [
        "bridal"
      ],
      "price": 185000,
      "compareAt": null,
      "weightG": 11.2,
      "makingPkr": 18000,
      "hallmarked": true,
      "antiTarnish": true,
      "images": [
      "assets/img/products/sitara-tikka.webp",
      "assets/img/products/sitara-tikka-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/sitara-tikka.webp",
      "assets/img/products/thumb/sitara-tikka-2.webp"
    ],
      "hover": "assets/img/products/sitara-tikka-2.webp",
      "overlay": null,
      "description": "A single star at the parting: a cabochon emerald held in 22k, with seed-pearl rain. Lightweight enough for a full baraat, grave enough for the photographs that last.",
      "details": [
        "22k hallmarked gold, 11.2 g",
        "Emerald centre, freshwater pearls",
        "Hook-and-chain back"
      ],
      "care": "Warm water, a drop of mild soap, a soft brush along the gallery. Rinse, pat dry, and a jeweller's cloth once a month. Bring it to the bench once a year and we re-polish it at no charge.",
      "look": [
        "noor-jahan",
        "mughal-choker",
        "lahore-jhumkas"
      ],
      "stackable": false,
      "tryOn": null,
      "featured": false,
      "newest": true,
      "bestSeller": false,
      "stock": 5,
      "sizeType": "none",
      "rating": 4.8,
      "reviews": 7,
      "tags": [
        "tikka",
        "maang tikka",
        "matha patti",
        "bridal headpiece",
        "gold",
        "emerald",
        "22k"
      ]
    },
    {
      "id": 4,
      "slug": "lahore-jhumkas",
      "name": "Lahore Jhumkas",
      "urdu": "جھمکے",
      "subtitle": "22k hallmarked gold, 16.8 g pair",
      "collection": "bridal-couture",
      "category": "earrings",
      "metal": "gold",
      "karat": "22k",
      "gemstone": "pearl",
      "occasion": [
        "bridal",
        "party"
      ],
      "price": 125000,
      "compareAt": null,
      "weightG": 16.8,
      "makingPkr": 16000,
      "hallmarked": true,
      "antiTarnish": true,
      "images": [
      "assets/img/products/lahore-jhumkas.webp",
      "assets/img/products/lahore-jhumkas-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/lahore-jhumkas.webp",
      "assets/img/products/thumb/lahore-jhumkas-2.webp"
    ],
      "hover": "assets/img/products/lahore-jhumkas-2.webp",
      "overlay": "assets/img/overlays/jhumka.webp",
      "description": "Bell jhumkas chased with floral jaali, finished with a single pearl. The silhouette is old Anarkali cinema; the weight is modern. They move when you do.",
      "details": [
        "22k hallmarked gold, 16.8 g pair",
        "Pearl drops",
        "Secure hinged hoop"
      ],
      "care": "Warm water, a drop of mild soap, a soft brush along the gallery. Rinse, pat dry, and a jeweller's cloth once a month. Bring it to the bench once a year and we re-polish it at no charge.",
      "look": [
        "noor-jahan",
        "whisper-bangle",
        "thread-chain"
      ],
      "stackable": false,
      "tryOn": "ear",
      "featured": true,
      "newest": false,
      "bestSeller": true,
      "stock": 4,
      "sizeType": "none",
      "rating": 4.6,
      "reviews": 9,
      "tags": [
        "earrings",
        "ear tops",
        "jhumka",
        "bali",
        "studs",
        "drops",
        "gold",
        "pearl",
        "22k"
      ]
    },
    {
      "id": 5,
      "slug": "pair-kangan",
      "name": "Pair of Kangan",
      "urdu": "",
      "subtitle": "22k hallmarked gold, 38.6 g pair",
      "collection": "bridal-couture",
      "category": "bangle",
      "metal": "gold",
      "karat": "22k",
      "gemstone": "none",
      "occasion": [
        "bridal",
        "everyday"
      ],
      "price": 420000,
      "compareAt": null,
      "weightG": 38.6,
      "makingPkr": 24000,
      "hallmarked": true,
      "antiTarnish": true,
      "images": [
      "assets/img/products/pair-kangan.webp",
      "assets/img/products/pair-kangan-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/pair-kangan.webp",
      "assets/img/products/thumb/pair-kangan-2.webp"
    ],
      "hover": "assets/img/products/pair-kangan-2.webp",
      "overlay": null,
      "description": "Two 22k kangan with Mughal floral engraving. A pair is the traditional gift; we sell them as they should be worn — together, with a faint chime.",
      "details": [
        "22k hallmarked gold, 38.6 g pair",
        "Inner diameter 2.5\" (size 2.6 available)",
        "Hand-engraved"
      ],
      "care": "Warm water, a drop of mild soap, a soft brush along the gallery. Rinse, pat dry, and a jeweller's cloth once a month. Bring it to the bench once a year and we re-polish it at no charge.",
      "look": [
        "whisper-bangle",
        "dawn-stack",
        "noor-jahan"
      ],
      "stackable": true,
      "tryOn": null,
      "featured": false,
      "newest": false,
      "bestSeller": false,
      "stock": 6,
      "sizeType": "bangle",
      "rating": 4.4,
      "reviews": 6,
      "tags": [
        "bangle",
        "kangan",
        "churi",
        "kara",
        "bracelet",
        "gold",
        "22k"
      ]
    },
    {
      "id": 6,
      "slug": "dawn-stack",
      "name": "Dawn Stacking Ring",
      "urdu": "",
      "subtitle": "22k hallmarked gold, 2.1 g",
      "collection": "stack-layer",
      "category": "ring",
      "metal": "gold",
      "karat": "22k",
      "gemstone": "emerald",
      "occasion": [
        "everyday",
        "office"
      ],
      "price": 42000,
      "compareAt": null,
      "weightG": 2.1,
      "makingPkr": 4500,
      "hallmarked": true,
      "antiTarnish": true,
      "images": [
      "assets/img/products/dawn-stack.webp",
      "assets/img/products/dawn-stack-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/dawn-stack.webp",
      "assets/img/products/thumb/dawn-stack-2.webp"
    ],
      "hover": "assets/img/products/dawn-stack-2.webp",
      "overlay": "assets/img/overlays/ring.webp",
      "description": "A knife-edge 22k band with a single emerald baguette. Designed to be stacked in threes — buy one, or build the dawn.",
      "details": [
        "22k hallmarked gold, 2.1 g",
        "Emerald baguette",
        "Comfort-fit band"
      ],
      "care": "Warm water, a drop of mild soap, a soft brush along the gallery. Rinse, pat dry, and a jeweller's cloth once a month. Bring it to the bench once a year and we re-polish it at no charge.",
      "look": [
        "whisper-bangle",
        "gold-hoops",
        "thread-chain"
      ],
      "stackable": true,
      "tryOn": "hand",
      "featured": true,
      "newest": true,
      "bestSeller": true,
      "stock": 12,
      "sizeType": "ring",
      "rating": 4.8,
      "reviews": 23,
      "tags": [
        "ring",
        "band",
        "anguthi",
        "solitaire",
        "gold",
        "emerald",
        "22k"
      ]
    },
    {
      "id": 7,
      "slug": "pearl-luna",
      "name": "Pearl Luna Studs",
      "urdu": "",
      "subtitle": "18k gold posts",
      "collection": "office-edit",
      "category": "earrings",
      "metal": "gold",
      "karat": "18k",
      "gemstone": "pearl",
      "occasion": [
        "office",
        "everyday"
      ],
      "price": 28500,
      "compareAt": null,
      "weightG": 1.8,
      "makingPkr": 3200,
      "hallmarked": true,
      "antiTarnish": true,
      "images": [
      "assets/img/products/pearl-luna.webp",
      "assets/img/products/pearl-luna-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/pearl-luna.webp",
      "assets/img/products/thumb/pearl-luna-2.webp"
    ],
      "hover": "assets/img/products/pearl-luna-2.webp",
      "overlay": null,
      "description": "7.5 mm cultured pearls on 18k posts. The daily earring that does not announce itself and is noticed anyway.",
      "details": [
        "18k gold posts",
        "Cultured freshwater pearls",
        "Butterfly backs"
      ],
      "care": "Warm water, a drop of mild soap, a soft brush along the gallery. Rinse, pat dry, and a jeweller's cloth once a month. Bring it to the bench once a year and we re-polish it at no charge.",
      "look": [
        "thread-chain",
        "dawn-stack",
        "gold-hoops"
      ],
      "stackable": false,
      "tryOn": "ear",
      "featured": false,
      "newest": false,
      "bestSeller": true,
      "stock": 14,
      "sizeType": "none",
      "rating": 4.4,
      "reviews": 20,
      "tags": [
        "earrings",
        "ear tops",
        "jhumka",
        "bali",
        "studs",
        "drops",
        "gold",
        "pearl",
        "18k"
      ]
    },
    {
      "id": 8,
      "slug": "thread-chain",
      "name": "Thread of Light Chain",
      "urdu": "",
      "subtitle": "22k hallmarked gold, 6.4 g",
      "collection": "everyday-gold",
      "category": "necklace",
      "metal": "gold",
      "karat": "22k",
      "gemstone": "none",
      "occasion": [
        "everyday",
        "office"
      ],
      "price": 95000,
      "compareAt": null,
      "weightG": 6.4,
      "makingPkr": 6500,
      "hallmarked": true,
      "antiTarnish": true,
      "images": [
      "assets/img/products/thread-chain.webp",
      "assets/img/products/thread-chain-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/thread-chain.webp",
      "assets/img/products/thumb/thread-chain-2.webp"
    ],
      "hover": "assets/img/products/thread-chain-2.webp",
      "overlay": null,
      "description": "A paperclip chain in 22k, 16 inches with a 2-inch extender. Fine enough for a collared shirt, sure enough to hold a future locket.",
      "details": [
        "22k hallmarked gold, 6.4 g",
        "40 + 5 cm",
        "Lobster clasp"
      ],
      "care": "Warm water, a drop of mild soap, a soft brush along the gallery. Rinse, pat dry, and a jeweller's cloth once a month. Bring it to the bench once a year and we re-polish it at no charge.",
      "look": [
        "pearl-luna",
        "dawn-stack",
        "gold-hoops"
      ],
      "stackable": true,
      "tryOn": null,
      "featured": true,
      "newest": false,
      "bestSeller": false,
      "stock": 9,
      "sizeType": "none",
      "rating": 4.3,
      "reviews": 11,
      "tags": [
        "necklace",
        "haar",
        "locket",
        "pendant",
        "choker",
        "gold",
        "22k"
      ]
    },
    {
      "id": 9,
      "slug": "whisper-bangle",
      "name": "Whisper Bangle",
      "urdu": "",
      "subtitle": "22k hallmarked gold, 8.2 g",
      "collection": "everyday-gold",
      "category": "bangle",
      "metal": "gold",
      "karat": "22k",
      "gemstone": "none",
      "occasion": [
        "everyday",
        "office"
      ],
      "price": 78000,
      "compareAt": null,
      "weightG": 8.2,
      "makingPkr": 5200,
      "hallmarked": true,
      "antiTarnish": true,
      "images": [
      "assets/img/products/whisper-bangle.webp",
      "assets/img/products/whisper-bangle-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/whisper-bangle.webp",
      "assets/img/products/thumb/whisper-bangle-2.webp"
    ],
      "hover": "assets/img/products/whisper-bangle-2.webp",
      "overlay": null,
      "description": "An oval 22k bangle, high polish, no motif. It is the piece you forget you are wearing until someone asks.",
      "details": [
        "22k hallmarked gold, 8.2 g",
        "Oval comfort shape",
        "Slip-on"
      ],
      "care": "Warm water, a drop of mild soap, a soft brush along the gallery. Rinse, pat dry, and a jeweller's cloth once a month. Bring it to the bench once a year and we re-polish it at no charge.",
      "look": [
        "dawn-stack",
        "pair-kangan",
        "pearl-luna"
      ],
      "stackable": true,
      "tryOn": "hand",
      "featured": false,
      "newest": true,
      "bestSeller": false,
      "stock": 8,
      "sizeType": "bangle",
      "rating": 4.3,
      "reviews": 10,
      "tags": [
        "bangle",
        "kangan",
        "churi",
        "kara",
        "bracelet",
        "gold",
        "22k"
      ]
    },
    {
      "id": 10,
      "slug": "gold-hoops",
      "name": "Small Gold Hoops",
      "urdu": "",
      "subtitle": "22k hallmarked gold, 3.4 g pair",
      "collection": "office-edit",
      "category": "earrings",
      "metal": "gold",
      "karat": "22k",
      "gemstone": "none",
      "occasion": [
        "everyday",
        "office",
        "party"
      ],
      "price": 36000,
      "compareAt": null,
      "weightG": 3.4,
      "makingPkr": 3800,
      "hallmarked": true,
      "antiTarnish": true,
      "images": [
      "assets/img/products/gold-hoops.webp",
      "assets/img/products/gold-hoops-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/gold-hoops.webp",
      "assets/img/products/thumb/gold-hoops-2.webp"
    ],
      "hover": "assets/img/products/gold-hoops-2.webp",
      "overlay": null,
      "description": "20 mm 22k hoops with a click-hinge. The architecture of a good day.",
      "details": [
        "22k hallmarked gold, 3.4 g pair",
        "20 mm diameter",
        "Hinged click"
      ],
      "care": "Warm water, a drop of mild soap, a soft brush along the gallery. Rinse, pat dry, and a jeweller's cloth once a month. Bring it to the bench once a year and we re-polish it at no charge.",
      "look": [
        "thread-chain",
        "dawn-stack",
        "pearl-luna"
      ],
      "stackable": false,
      "tryOn": "ear",
      "featured": false,
      "newest": false,
      "bestSeller": true,
      "stock": 11,
      "sizeType": "none",
      "rating": 4.7,
      "reviews": 21,
      "tags": [
        "earrings",
        "ear tops",
        "jhumka",
        "bali",
        "studs",
        "drops",
        "gold",
        "22k"
      ]
    },
    {
      "id": 11,
      "slug": "emerald-teardrop",
      "name": "Emerald Teardrop Earrings",
      "urdu": "",
      "subtitle": "18k gold",
      "collection": "party-lights",
      "category": "earrings",
      "metal": "gold",
      "karat": "18k",
      "gemstone": "emerald",
      "occasion": [
        "party",
        "bridal"
      ],
      "price": 245000,
      "compareAt": null,
      "weightG": 7.6,
      "makingPkr": 22000,
      "hallmarked": true,
      "antiTarnish": true,
      "images": [
      "assets/img/products/emerald-teardrop.webp",
      "assets/img/products/emerald-teardrop-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/emerald-teardrop.webp",
      "assets/img/products/thumb/emerald-teardrop-2.webp"
    ],
      "hover": "assets/img/products/emerald-teardrop-2.webp",
      "overlay": null,
      "description": "Zambian-colour emerald drops in 18k, each with a diamond-look halo. They read as heirloom under lamplight.",
      "details": [
        "18k gold",
        "Faceted emerald drops",
        "Lever backs"
      ],
      "care": "Warm water, a drop of mild soap, a soft brush along the gallery. Rinse, pat dry, and a jeweller's cloth once a month. Bring it to the bench once a year and we re-polish it at no charge.",
      "look": [
        "sultan-ring",
        "constellation",
        "mughal-choker"
      ],
      "stackable": false,
      "tryOn": "ear",
      "featured": true,
      "newest": false,
      "bestSeller": false,
      "stock": 3,
      "sizeType": "none",
      "rating": 4.3,
      "reviews": 6,
      "tags": [
        "earrings",
        "ear tops",
        "jhumka",
        "bali",
        "studs",
        "drops",
        "gold",
        "emerald",
        "18k"
      ]
    },
    {
      "id": 12,
      "slug": "constellation",
      "name": "Constellation Bracelet",
      "urdu": "",
      "subtitle": "Rhodium-plated brass, CZ",
      "collection": "party-lights",
      "category": "bracelet",
      "metal": "plated",
      "karat": "18k",
      "gemstone": "cz",
      "occasion": [
        "party",
        "office"
      ],
      "price": 16500,
      "compareAt": 22000,
      "weightG": 4.1,
      "makingPkr": 0,
      "hallmarked": false,
      "antiTarnish": true,
      "images": [
      "assets/img/products/constellation.webp",
      "assets/img/products/constellation-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/constellation.webp",
      "assets/img/products/thumb/constellation-2.webp"
    ],
      "hover": "assets/img/products/constellation-2.webp",
      "overlay": null,
      "description": "A tennis line of brilliant-cut cubic zirconia in rhodium-finished white metal. Anti-tarnish plated. The night sky, made portable.",
      "details": [
        "Rhodium-plated brass, CZ",
        "17 cm + extender",
        "Anti-tarnish coating"
      ],
      "care": "Last on, first off. Keep it away from perfume and attar, wipe after wear with the flannel in the box, and it will hold its colour for years.",
      "look": [
        "emerald-teardrop",
        "cz-solitaire",
        "rose-layered"
      ],
      "stackable": false,
      "tryOn": null,
      "featured": false,
      "newest": true,
      "bestSeller": false,
      "stock": 16,
      "sizeType": "none",
      "rating": 5,
      "reviews": 32,
      "tags": [
        "bracelet",
        "chain bracelet",
        "kara",
        "plated",
        "cz",
        "18k"
      ]
    },
    {
      "id": 13,
      "slug": "sultan-ring",
      "name": "Sultan Cocktail Ring",
      "urdu": "",
      "subtitle": "22k hallmarked gold, 9.8 g",
      "collection": "party-lights",
      "category": "ring",
      "metal": "gold",
      "karat": "22k",
      "gemstone": "emerald",
      "occasion": [
        "party",
        "bridal"
      ],
      "price": 320000,
      "compareAt": null,
      "weightG": 9.8,
      "makingPkr": 28000,
      "hallmarked": true,
      "antiTarnish": true,
      "images": [
      "assets/img/products/sultan-ring.webp",
      "assets/img/products/sultan-ring-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/sultan-ring.webp",
      "assets/img/products/thumb/sultan-ring-2.webp"
    ],
      "hover": "assets/img/products/sultan-ring-2.webp",
      "overlay": "assets/img/overlays/ring.webp",
      "description": "An oval emerald in a closed 22k gallery, diamond-look melee around the shoulder. A ring that ends a conversation politely.",
      "details": [
        "22k hallmarked gold, 9.8 g",
        "Oval emerald",
        "Gallery setting"
      ],
      "care": "Warm water, a drop of mild soap, a soft brush along the gallery. Rinse, pat dry, and a jeweller's cloth once a month. Bring it to the bench once a year and we re-polish it at no charge.",
      "look": [
        "emerald-teardrop",
        "mughal-choker",
        "whisper-bangle"
      ],
      "stackable": false,
      "tryOn": "hand",
      "featured": true,
      "newest": false,
      "bestSeller": false,
      "stock": 2,
      "sizeType": "ring",
      "rating": 4.7,
      "reviews": 6,
      "tags": [
        "ring",
        "band",
        "anguthi",
        "solitaire",
        "gold",
        "emerald",
        "22k"
      ]
    },
    {
      "id": 14,
      "slug": "ravi-chain",
      "name": "Ravi Figaro Chain",
      "urdu": "",
      "subtitle": "22k hallmarked gold, 14.2 g",
      "collection": "everyday-gold",
      "category": "necklace",
      "metal": "gold",
      "karat": "22k",
      "gemstone": "none",
      "occasion": [
        "everyday",
        "party"
      ],
      "price": 210000,
      "compareAt": null,
      "weightG": 14.2,
      "makingPkr": 9000,
      "hallmarked": true,
      "antiTarnish": true,
      "images": [
      "assets/img/products/ravi-chain.webp",
      "assets/img/products/ravi-chain-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/ravi-chain.webp",
      "assets/img/products/thumb/ravi-chain-2.webp"
    ],
      "hover": "assets/img/products/ravi-chain-2.webp",
      "overlay": null,
      "description": "A denser 22k Figaro — the river chain. Wear it alone, or let it carry a future locket of someone you love.",
      "details": [
        "22k hallmarked gold, 14.2 g",
        "45 cm",
        "Lobster clasp"
      ],
      "care": "Warm water, a drop of mild soap, a soft brush along the gallery. Rinse, pat dry, and a jeweller's cloth once a month. Bring it to the bench once a year and we re-polish it at no charge.",
      "look": [
        "gold-hoops",
        "whisper-bangle",
        "dawn-stack"
      ],
      "stackable": false,
      "tryOn": null,
      "featured": false,
      "newest": false,
      "bestSeller": false,
      "stock": 5,
      "sizeType": "none",
      "rating": 4.5,
      "reviews": 6,
      "tags": [
        "necklace",
        "haar",
        "locket",
        "pendant",
        "choker",
        "gold",
        "22k"
      ]
    },
    {
      "id": 15,
      "slug": "moonlight-choker",
      "name": "Moonlight Silver Choker",
      "urdu": "",
      "subtitle": "925 sterling, oxidized",
      "collection": "silver-stones",
      "category": "necklace",
      "metal": "silver",
      "karat": "925",
      "gemstone": "moonstone",
      "occasion": [
        "party",
        "everyday"
      ],
      "price": 18500,
      "compareAt": null,
      "weightG": 28,
      "makingPkr": 2400,
      "hallmarked": true,
      "antiTarnish": false,
      "images": [
      "assets/img/products/moonlight-choker.webp",
      "assets/img/products/moonlight-choker-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/moonlight-choker.webp",
      "assets/img/products/thumb/moonlight-choker-2.webp"
    ],
      "hover": "assets/img/products/moonlight-choker-2.webp",
      "overlay": null,
      "description": "Oxidized 925 silver with moonstone cabochons. A choker for nights that start too late and end too well.",
      "details": [
        "925 sterling, oxidized",
        "Moonstone cabochons",
        "Hook clasp"
      ],
      "care": "Silver darkens in the recesses — that is the work, not a fault. A silver cloth in straight strokes on the high points only. Never toothpaste, never lemon near stones.",
      "look": [
        "payal-stars",
        "cz-solitaire",
        "rose-layered"
      ],
      "stackable": false,
      "tryOn": null,
      "featured": false,
      "newest": true,
      "bestSeller": false,
      "stock": 7,
      "sizeType": "none",
      "rating": 4.5,
      "reviews": 28,
      "tags": [
        "necklace",
        "haar",
        "locket",
        "pendant",
        "choker",
        "silver",
        "moonstone",
        "925"
      ]
    },
    {
      "id": 16,
      "slug": "payal-stars",
      "name": "Payal of Stars",
      "urdu": "",
      "subtitle": "925 sterling, pair",
      "collection": "silver-stones",
      "category": "anklet",
      "metal": "silver",
      "karat": "925",
      "gemstone": "none",
      "occasion": [
        "everyday",
        "bridal"
      ],
      "price": 12800,
      "compareAt": null,
      "weightG": 22.4,
      "makingPkr": 1800,
      "hallmarked": true,
      "antiTarnish": false,
      "images": [
        "assets/img/products/payal-stars.webp"
      ],
      "thumbs": [
        "assets/img/products/thumb/payal-stars.webp"
      ],
      "hover": "assets/img/products/payal-stars.webp",
      "overlay": null,
      "description": "A pair of 925 payal with star charms and a quiet ghungroo. For the ankle that leads a room.",
      "details": [
        "925 sterling, pair",
        "Adjustable 22–26 cm",
        "Star charms"
      ],
      "care": "Silver darkens in the recesses — that is the work, not a fault. A silver cloth in straight strokes on the high points only. Never toothpaste, never lemon near stones.",
      "look": [
        "moonlight-choker",
        "pearl-luna",
        "dawn-stack"
      ],
      "stackable": false,
      "tryOn": null,
      "featured": false,
      "newest": false,
      "bestSeller": false,
      "stock": 10,
      "sizeType": "none",
      "rating": 4.4,
      "reviews": 36,
      "tags": [
        "anklet",
        "payal",
        "pazeb",
        "ghungroo",
        "silver",
        "925"
      ]
    },
    {
      "id": 17,
      "slug": "cz-solitaire",
      "name": "Light Solitaire",
      "urdu": "",
      "subtitle": "925 silver, rhodium",
      "collection": "silver-stones",
      "category": "ring",
      "metal": "silver",
      "karat": "925",
      "gemstone": "cz",
      "occasion": [
        "everyday",
        "office"
      ],
      "price": 8900,
      "compareAt": null,
      "weightG": 3.2,
      "makingPkr": 900,
      "hallmarked": true,
      "antiTarnish": true,
      "images": [
      "assets/img/products/cz-solitaire.webp",
      "assets/img/products/cz-solitaire-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/cz-solitaire.webp",
      "assets/img/products/thumb/cz-solitaire-2.webp"
    ],
      "hover": "assets/img/products/cz-solitaire-2.webp",
      "overlay": "assets/img/overlays/ring.webp",
      "description": "A six-prong cubic zirconia on 925 silver, rhodium-finished. The promise ring that does not pretend to be a diamond — it pretends to be light.",
      "details": [
        "925 silver, rhodium",
        "6 mm CZ",
        "Comfort band"
      ],
      "care": "Silver darkens in the recesses — that is the work, not a fault. A silver cloth in straight strokes on the high points only. Never toothpaste, never lemon near stones.",
      "look": [
        "constellation",
        "rose-layered",
        "pearl-luna"
      ],
      "stackable": true,
      "tryOn": "hand",
      "featured": false,
      "newest": false,
      "bestSeller": false,
      "stock": 18,
      "sizeType": "ring",
      "rating": 4.9,
      "reviews": 47,
      "tags": [
        "ring",
        "band",
        "anguthi",
        "solitaire",
        "silver",
        "cz",
        "925"
      ]
    },
    {
      "id": 18,
      "slug": "rose-layered",
      "name": "Rose Layered Necklace",
      "urdu": "",
      "subtitle": "Rose-gold plated brass",
      "collection": "stack-layer",
      "category": "necklace",
      "metal": "plated",
      "karat": "",
      "gemstone": "none",
      "occasion": [
        "everyday",
        "office",
        "party"
      ],
      "price": 6450,
      "compareAt": 8900,
      "weightG": 8,
      "makingPkr": 0,
      "hallmarked": false,
      "antiTarnish": true,
      "images": [
      "assets/img/products/rose-layered.webp",
      "assets/img/products/rose-layered-2.webp"
    ],
      "thumbs": [
      "assets/img/products/thumb/rose-layered.webp",
      "assets/img/products/thumb/rose-layered-2.webp"
    ],
      "hover": "assets/img/products/rose-layered-2.webp",
      "overlay": null,
      "description": "Three lengths of rose-gold plating, a disc on the longest. Anti-tarnish. Built for layering with the Thread of Light if you graduate to gold.",
      "details": [
        "Rose-gold plated brass",
        "Anti-tarnish",
        "Three-strand"
      ],
      "care": "Last on, first off. Keep it away from perfume and attar, wipe after wear with the flannel in the box, and it will hold its colour for years.",
      "look": [
        "gold-hoops",
        "cz-solitaire",
        "constellation"
      ],
      "stackable": true,
      "tryOn": null,
      "featured": false,
      "newest": true,
      "bestSeller": false,
      "stock": 20,
      "sizeType": "none",
      "rating": 4.7,
      "reviews": 48,
      "tags": [
        "necklace",
        "haar",
        "locket",
        "pendant",
        "choker",
        "plated"
      ]
    }
  ];

  const articles = [
    {
      "id": 1,
      "slug": "bridal-couture-week-lahore",
      "title": "What the brides actually wore at Couture Week",
      "dek": "Away from the ramp: closed chokers, a single tikka, and the return of quiet gold.",
      "category": "bridal",
      "date": "2026-08-18",
      "readMin": 6,
      "image": "assets/img/editorial/bridal.webp",
      "body": [
        "The loudest jewellery on the ramp was not what left the building. In the front rows and the after-parties, Lahore’s brides chose closed kundan chokers, a maang tikka worn slightly off-centre, and bangles that could survive a mehndi without a jeweller on speed-dial.",
        "Sitara’s Noor Jahan set was built for this mood: heirloom density, modern sit. A haar should not require a neck like a column. Ours is cut so the weight lives on the collarbone, not the spine.",
        "If you are collecting a trousseau this season, buy the tikka first. It photographs. It packs. It is the piece daughters steal."
      ]
    },
    {
      "id": 2,
      "slug": "how-to-clean-silver-at-home",
      "title": "How to clean silver at home (without ruining it)",
      "dek": "Baking soda is not a personality. Here is the method our bench actually uses.",
      "category": "care",
      "date": "2026-07-02",
      "readMin": 4,
      "image": "assets/img/editorial/clean.webp",
      "body": [
        "Oxidized silver is meant to be dark in the recesses. If you boil it in foil and soda, you erase the work. Sitara’s moonlight pieces should be wiped with a microfibre cloth, then a drop of mild soap, then dried like you mean it.",
        "For 925 that has gone grey on the high points only: a silver cloth, straight strokes, no circles. Never toothpaste. Never lemon on stones.",
        "Gold, by contrast, likes warmth. A bowl of lukewarm water, a drop of dish soap, a soft brush along the gallery. Rinse. Pat. A jeweller’s cloth once a month."
      ]
    },
    {
      "id": 3,
      "slug": "office-gold-the-three-piece-rule",
      "title": "The three-piece rule for office gold",
      "dek": "Studs, a chain, a knife-edge ring. Anything else is a meeting.",
      "category": "looks",
      "date": "2026-06-11",
      "readMin": 3,
      "image": "assets/img/editorial/lookbook.webp",
      "body": [
        "Pakistani offices still read jewellery as character. Too little looks unfinished; too much looks like you are leaving at four for a walima. The edit that works: Pearl Luna studs, the Thread of Light, one Dawn stacking ring.",
        "Hoops if the day includes dinner. A bangle if it includes your mother.",
        "Save emeralds for the evenings you intend to remember."
      ]
    },
    {
      "id": 4,
      "slug": "inside-the-lahore-bench",
      "title": "Inside the bench: how a 22k ring is still made",
      "dek": "Wax, fire, files, and a man who has been chasing a seam since 1987.",
      "category": "craft",
      "date": "2026-05-09",
      "readMin": 7,
      "image": "assets/img/editorial/craft.webp",
      "body": [
        "Sitara does not own a factory. We own a bench, and the bench owns us. Gold arrives as a grain, becomes a wire, becomes a gallery. The emerald is not glued. It is bedded.",
        "Hallmarking is not a sticker. Every 22k piece over 2 grams leaves with a Karatstamp and a Sitara maker’s mark. If a piece cannot be marked, we do not call it gold.",
        "You can visit. Tuesdays, by appointment, in the old city light."
      ]
    },
    {
      "id": 5,
      "slug": "stacking-without-looking-busy",
      "title": "Stacking without looking busy",
      "dek": "Three rings, one story. The rest is noise.",
      "category": "looks",
      "date": "2026-04-22",
      "readMin": 4,
      "image": "assets/img/editorial/hand-stack.webp",
      "body": [
        "A stack is a sentence. Knife-edge, baguette, knife-edge. Or gold, gold, a single silver solitaire as a comma. Do not mix four textures unless you are on a campaign.",
        "Our configurator exists because the hand is not a moodboard. Build on a real silhouette, then add the stack at a bundle price — we take ten percent off three."
      ]
    },
    {
      "id": 6,
      "slug": "celebrity-looks-we-would-actually-wear",
      "title": "Celebrity looks we would actually wear",
      "dek": "Not the red carpet. The airport, the dholki, the Tuesday.",
      "category": "looks",
      "date": "2026-03-30",
      "readMin": 5,
      "image": "assets/img/editorial/everyday.webp",
      "body": [
        "Mahira’s small hoops in a white shirt did more for 22k than any award-show haar. Mawra’s pearl studs at a morning show. A single kangan on an otherwise bare wrist in a black sari.",
        "Copy the scale, not the costume. Sitara will not sell you a replica of a film set. We will sell you the piece that made the still worth keeping."
      ]
    }
  ];

  const collections = [
    {
      "slug": "bridal-couture",
      "name": "Bridal Couture",
      "blurb": "Trousseau pieces wrought for a lifetime.",
      "image": "assets/img/editorial/bridal.webp"
    },
    {
      "slug": "everyday-gold",
      "name": "Everyday Gold",
      "blurb": "Quiet 22k for the hours that are yours.",
      "image": "assets/img/editorial/everyday.webp"
    },
    {
      "slug": "office-edit",
      "name": "The Office Edit",
      "blurb": "Minimal lines that read as composure.",
      "image": "assets/img/products/pearl-luna.webp"
    },
    {
      "slug": "party-lights",
      "name": "Party Lights",
      "blurb": "Gems that catch a room and keep it.",
      "image": "assets/img/products/emerald-teardrop.webp"
    },
    {
      "slug": "silver-stones",
      "name": "Silver & Stones",
      "blurb": "Moonlight metal, made to live in.",
      "image": "assets/img/products/moonlight-choker.webp"
    },
    {
      "slug": "stack-layer",
      "name": "Stack & Layer",
      "blurb": "Build a language of rings and chains.",
      "image": "assets/img/editorial/hand-stack.webp"
    }
  ];

  /* ------------------------------------------------------------------ search
     Roman Urdu, Urdu and common misspellings mapped onto catalogue words, so a
     shopper typing what she would say out loud still finds the piece. */
  const synonyms = {
    "ear tops": "earrings", tops: "earrings", bali: "earrings", baali: "earrings",
    jhumke: "jhumka", jhumkay: "jhumka", jhumka: "earrings jhumka",
    churi: "bangle", choori: "bangle", chudi: "bangle", kangan: "bangle",
    kara: "bangle", karay: "bangle",
    chandi: "silver", sona: "gold", sonay: "gold",
    zamurrad: "emerald", zamurd: "emerald", panna: "emerald",
    moti: "pearl", motee: "pearl", heera: "diamond", heeray: "diamond",
    dulhan: "bridal", shaadi: "bridal", baraat: "bridal", mehndi: "bridal",
    nikah: "bridal", mangni: "ring", anguthi: "ring", angoothi: "ring",
    pazeb: "anklet", payal: "anklet", haar: "necklace", locket: "necklace",
    set: "bridal", tikka: "tikka", "matha patti": "tikka",
    sasta: "everyday", tola: "gold",
  };

  /* -------------------------------------------------------------- ring sizes
     The Pakistani/Indian scale is what a Lahore goldsmith actually measures in.
     Circumference in mm, with UK and US equivalents. */
  const ringSizes = [
    { pk: 8, mm: 48.0, uk: "I", us: 4.5 }, { pk: 9, mm: 49.3, uk: "J", us: 5 },
    { pk: 10, mm: 50.6, uk: "K", us: 5.5 }, { pk: 11, mm: 51.9, uk: "L", us: 6 },
    { pk: 12, mm: 53.1, uk: "M", us: 6.5 }, { pk: 13, mm: 54.4, uk: "N", us: 7 },
    { pk: 14, mm: 55.7, uk: "O", us: 7.5 }, { pk: 15, mm: 57.0, uk: "P", us: 8 },
    { pk: 16, mm: 58.3, uk: "Q", us: 8.5 }, { pk: 17, mm: 59.5, uk: "R", us: 9 },
    { pk: 18, mm: 60.8, uk: "S", us: 9.5 }, { pk: 19, mm: 62.1, uk: "T", us: 10 },
    { pk: 20, mm: 63.4, uk: "U", us: 10.5 },
  ];

  /** Inner diameter in inches — how bangles are sold in Pakistan. */
  const bangleSizes = [
    { id: "2.4", inches: '2.4"', mm: 61.0, note: "Petite" },
    { id: "2.5", inches: '2.5"', mm: 63.5, note: "Small" },
    { id: "2.6", inches: '2.6"', mm: 66.0, note: "Most ordered" },
    { id: "2.8", inches: '2.8"', mm: 71.1, note: "Generous" },
  ];

  const chainLengths = [
    { id: "16", label: '16 in / 40 cm', note: "Sits at the base of the throat" },
    { id: "18", label: '18 in / 45 cm', note: "Collarbone — the safe gift length" },
    { id: "20", label: '20 in / 50 cm', note: "Just below the collarbone, layers well" },
    { id: "22", label: '22 in / 55 cm', note: "Over kurtas and high necks" },
  ];

  /* ------------------------------------------------------------------ cities
     Courier zones, used for delivery estimates before checkout. */
  const cities = [
    { name: "Lahore", zone: 1 }, { name: "Karachi", zone: 1 }, { name: "Islamabad", zone: 1 },
    { name: "Rawalpindi", zone: 1 }, { name: "Faisalabad", zone: 1 }, { name: "Multan", zone: 1 },
    { name: "Peshawar", zone: 1 }, { name: "Sialkot", zone: 2 }, { name: "Gujranwala", zone: 2 },
    { name: "Hyderabad", zone: 2 }, { name: "Quetta", zone: 2 }, { name: "Sargodha", zone: 2 },
    { name: "Bahawalpur", zone: 2 }, { name: "Abbottabad", zone: 2 }, { name: "Sukkur", zone: 2 },
    { name: "Mardan", zone: 2 }, { name: "Gilgit", zone: 3 }, { name: "Skardu", zone: 3 },
    { name: "Chitral", zone: 3 }, { name: "Gwadar", zone: 3 },
  ];

  /* ------------------------------------------------------------- gift finder
     Budget bands used by /gifts and the finder quiz. */
  const giftBands = [
    { id: "under-25", label: "Under PKR 25,000", max: 25000, blurb: "Studs, chains, a first silver piece" },
    { id: "25-75", label: "PKR 25,000 – 75,000", max: 75000, blurb: "Hoops, stacking rings, a bangle" },
    { id: "75-200", label: "PKR 75,000 – 200,000", max: 200000, blurb: "Statement earrings, a solitaire" },
    { id: "200-plus", label: "Above PKR 200,000", max: Infinity, blurb: "Trousseau and heirloom" },
  ];

  /* ---------------------------------------------------------- finder quiz
     Four questions, scored against the catalogue in app.js. */
  const quiz = [
    {
      id: "who",
      question: "Who is it for?",
      options: [
        { id: "self", label: "Myself", weight: { everyday: 2, office: 1 } },
        { id: "bride", label: "A bride", weight: { bridal: 3 } },
        { id: "mother", label: "My mother", weight: { party: 2, everyday: 1 } },
        { id: "friend", label: "A friend", weight: { everyday: 2, party: 1 } },
      ],
    },
    {
      id: "wear",
      question: "When will it be worn?",
      options: [
        { id: "daily", label: "Every single day", weight: { everyday: 3 } },
        { id: "work", label: "At work", weight: { office: 3 } },
        { id: "events", label: "Weddings and dinners", weight: { party: 3 } },
        { id: "once", label: "One enormous day", weight: { bridal: 3 } },
      ],
    },
    {
      id: "metal",
      question: "Which metal?",
      options: [
        { id: "gold", label: "Gold", metal: "gold" },
        { id: "silver", label: "Silver", metal: "silver" },
        { id: "plated", label: "Gold-plated", metal: "plated" },
        { id: "any", label: "Surprise me", metal: null },
      ],
    },
    {
      id: "budget",
      question: "What are you comfortable spending?",
      options: [
        { id: "a", label: "Under 25,000", max: 25000 },
        { id: "b", label: "25,000 – 75,000", max: 75000 },
        { id: "c", label: "75,000 – 300,000", max: 300000 },
        { id: "d", label: "No ceiling", max: Infinity },
      ],
    },
  ];

  /* --------------------------------------------------------- loyalty tiers */
  const tiers = [
    { id: "moti", name: "Moti", min: 0, rate: 1, perks: ["1 coin per PKR 100", "Birthday polish"] },
    { id: "chandi", name: "Chandi", min: 50000, rate: 1.5, perks: ["1.5 coins per PKR 100", "Free delivery always", "Early access to drops"] },
    { id: "sona", name: "Sona", min: 250000, rate: 2, perks: ["2 coins per PKR 100", "Free resizing for life", "Private atelier appointments"] },
    { id: "sitara", name: "Sitara", min: 1000000, rate: 3, perks: ["3 coins per PKR 100", "A dedicated keeper", "First refusal on one-off pieces"] },
  ];

  /* ------------------------------------------------- trousseau checklist */
  const trousseau = [
    { id: "haar", label: "Haar or choker", category: "necklace", note: "The photograph piece" },
    { id: "tikka", label: "Maang tikka", category: "tikka", note: "Buy this first — it travels" },
    { id: "jhumka", label: "Jhumkas", category: "earrings", note: "Screw backs for three days of wear" },
    { id: "kangan", label: "Kangan or churiyan", category: "bangle", note: "Sold in pairs" },
    { id: "ring", label: "Ring", category: "ring", note: "Sized at the end of the day" },
    { id: "payal", label: "Payal", category: "anklet", note: "Silver is traditional" },
  ];

  const faqs = [
    { q: "Is cash on delivery available?", a: "Yes, anywhere in Pakistan on orders up to PKR 200,000. Above that we ask for a 30% advance, because the rider is carrying a great deal of gold." },
    { q: "How do I know the gold is really 22k?", a: "Every gold piece is assayed and stamped: 916 for 22k, 875 for 21k, 750 for 18k, alongside our maker's mark. The day's Sarafa rate is on the ticker at the top of every page so you can check our arithmetic yourself." },
    { q: "What is a fair making charge?", a: "Ours is a fixed rupee figure per piece, printed on the invoice — never a percentage of the metal weight. You can see it on every product page before you buy." },
    { q: "Can I return it?", a: "Seven days from delivery, unworn and in its box, for a full refund. Engraved and made-to-order bridal can be exchanged but not returned." },
    { q: "Do you resize rings?", a: "Free for life on gold, up to two sizes either way. Post it back or bring it to Liberty Market." },
    { q: "How long does bridal take?", a: "Six weeks from the signed drawing. Start eight weeks before the date if you can — the last fortnight is always busier than anyone plans for." },
    { q: "Is it safe to wear in wudu?", a: "Gold and anything marked anti-tarnish, yes. Take plated pieces off first, and dry sterling properly afterwards." },
    { q: "Do you ship outside Pakistan?", a: "By arrangement. Message the desk on WhatsApp with the piece and the destination and we will quote you." },
  ];

  return {
    products, articles, collections, synonyms, ringSizes, bangleSizes, chainLengths,
    cities, giftBands, quiz, tiers, trousseau, faqs,
  };
});
