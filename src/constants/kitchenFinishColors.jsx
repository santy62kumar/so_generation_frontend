// kitchenFinishColors.js
// ─────────────────────────────────────────────────────────────────────────
// Single source of truth for every color-finish swatch used in the
// "Kitchen Color Finishes" block. Each entry is intentionally tiny —
// { id, name, thumb } — never the full-resolution image. The actual
// print-quality file only gets touched on the backend, and only for the
// handful of colors a given order actually selected (see pdfgenerator.py).
//
// `thumb` points at a small pre-generated WebP (~160x160, ~2-4KB each).
// See /scripts/build-finish-thumbs.py for how these are produced from the
// master catalog images — resize to a fixed square, convert to WebP,
// quality ~75. That single pass takes the sample set in this project from
// 19MB → ~48KB (a 99.7% reduction) with no visible quality loss at
// dropdown-swatch size.
//
// ⚠️ Only the colors we were given real reference images for are filled in
// below (marked ✅). The rest are TODO placeholders — replace `thumb` and
// `name` with the real catalog entries following the exact same shape.
// Do NOT hand-add all 70-80 of these as raw imports; see the "efficient
// storage" notes at the bottom of this file.

export const CABINET_COLORS = [
  // ✅ real samples supplied
  // { id: 'abyss-edge',          name: 'Abyss Edge',          thumb_url: '/finishes/cabinet/abyss-edge.webp' },
  // { id: 'canyon-ridge-gloss',  name: 'Canyon Ridge Gloss',  thumb_url: '/finishes/cabinet/canyon-ridge-gloss.webp' },
  // { id: 'canyon-ridge-matte',  name: 'Canyon Ridge Matte',  thumb_url: '/finishes/cabinet/canyon-ridge-matte.webp' },
  // { id: 'cavern-grey',         name: 'Cavern Grey',         thumb_url: '/finishes/cabinet/cavern-grey.webp' },
  // { id: 'celestial-sky',       name: 'Celestial Sky',       thumb_url: '/finishes/cabinet/celestial-sky.webp' },
  // TODO — add the remaining 27 cabinet colors here, same shape:
  // { id: 'slug-id', name: 'Display Name', thumb: '/finishes/cabinet/slug-id.webp' },



  { id: 'abyss-edge',                name: 'Abyss Edge',                thumb_url: '/finishes/cabinet/abyss-edge.webp' },
  { id: 'canyon-ridge-gloss',        name: 'Canyon Ridge Gloss',        thumb_url: '/finishes/cabinet/canyon-ridge-gloss.webp' },
  { id: 'canyon-ridge-matte',        name: 'Canyon Ridge Matte',        thumb_url: '/finishes/cabinet/canyon-ridge-matte.webp' },
  { id: 'cavern-grey',               name: 'Cavern Grey',               thumb_url: '/finishes/cabinet/cavern-grey.webp' },
  { id: 'celestial-sky',             name: 'Celestial Sky',             thumb_url: '/finishes/cabinet/celestial-sky.webp' },
  { id: 'chamber-teak',              name: 'Chamber Teak',              thumb_url: '/finishes/cabinet/chamber-teak.webp' },
  { id: 'courtyard-clay-gloss',      name: 'Courtyard Clay Gloss',      thumb_url: '/finishes/cabinet/courtyard-clay-gloss.webp' },
  { id: 'courtyard-clay-matte',      name: 'Courtyard Clay Matte',      thumb_url: '/finishes/cabinet/courtyard-clay-matte.webp' },
  { id: 'crater-dust',               name: 'Crater Dust',               thumb_url: '/finishes/cabinet/crater-dust.webp' },
  { id: 'desert-dune',               name: 'Desert Dune',               thumb_url: '/finishes/cabinet/desert-dune.webp' },
  { id: 'dew-room',                  name: 'Dew Room',                  thumb_url: '/finishes/cabinet/dew-room.webp' },
  { id: 'glacier-veil-matte',        name: 'Glacier Veil Matte',        thumb_url: '/finishes/cabinet/glacier-veil-matte.webp' },
  { id: 'industrial-bay-matte',      name: 'Industrial Bay Matte',      thumb_url: '/finishes/cabinet/industrial-bay-matte.webp' },
  { id: 'lumen-sand',                name: 'LumenSand',                 thumb_url: '/finishes/cabinet/lumen-sand.webp' },
  { id: 'marsh-bank-gloss',          name: 'Marsh Bank Gloss',          thumb_url: '/finishes/cabinet/marsh-bank-gloss.webp' },
  { id: 'metal-moon',                name: 'Metal Moon',                thumb_url: '/finishes/cabinet/metal-moon.webp' },
  { id: 'mine-grade',                name: 'Mine Grade',                thumb_url: '/finishes/cabinet/mine-grade.webp' },
  { id: 'mistfield-gloss',           name: 'Mistfield Gloss',           thumb_url: '/finishes/cabinet/mistfield-gloss.webp' },
  { id: 'oasis-ivory-gloss',         name: 'Oasis Ivory Gloss',         thumb_url: '/finishes/cabinet/oasis-ivory-gloss.webp' },
  { id: 'peruvian-walnut',           name: 'Peruvian Walnut',           thumb_url: '/finishes/cabinet/peruvian-walnut.webp' },
  { id: 'petal-dust',                name: 'Petal Dust',                thumb_url: '/finishes/cabinet/petal-dust.webp' },
  { id: 'pour-line',                 name: 'Pour Line',                 thumb_url: '/finishes/cabinet/pour-line.webp' },
  { id: 'praprie',                   name: 'Praprie',                   thumb_url: '/finishes/cabinet/praprie.webp' },
  { id: 'river-raft',                name: 'River Raft',                thumb_url: '/finishes/cabinet/river-raft.webp' },
  { id: 'salt-flat-matte',           name: 'Salt Flat Matte',           thumb_url: '/finishes/cabinet/salt-flat-matte.webp' },
  { id: 'sienna-husk',               name: 'Sienna Husk',               thumb_url: '/finishes/cabinet/sienna-husk.webp' },
  { id: 'silt-root-matte',           name: 'Silt Root Matte',           thumb_url: '/finishes/cabinet/silt-root-matte.webp' },
  { id: 'terrace-vine',              name: 'Terrace Vine',              thumb_url: '/finishes/cabinet/terrace-vine.webp' },
  { id: 'trench-teal',               name: 'Trench Teal',               thumb_url: '/finishes/cabinet/trench-teal.webp' },
  { id: 'tundra',                    name: 'Tundra',                    thumb_url: '/finishes/cabinet/tundra.webp' },
  { id: 'tuscan-oak',                name: 'Tuscan Oak',                thumb_url: '/finishes/cabinet/tuscan-oak.webp' },

];

export const GLASS_COLORS = [
  // ✅ 23 real samples from glass_finishes.zip
  
  { id: 'back-painted-fluted-glass-ash',          name: 'Back Painted Fluted Glass Ash',          thumb_url: '/finishes/glass/back-painted-fluted-glass-ash.webp' },
  { id: 'back-painted-fluted-glass-biscuit',      name: 'Back Painted Fluted Glass Biscuit',      thumb_url: '/finishes/glass/back-painted-fluted-glass-biscuit.webp' },
  { id: 'back-painted-fluted-glass-maple-bronze', name: 'Back Painted Fluted Glass Maple Bronze', thumb_url: '/finishes/glass/back-painted-fluted-glass-maple-bronze.webp' },
  { id: 'back-painted-frosted-glass-beige',       name: 'Back Painted Frosted Glass Beige',       thumb_url: '/finishes/glass/back-painted-frosted-glass-beige.webp' },
  { id: 'back-painted-frosted-glass-graphite',    name: 'Back Painted Frosted Glass Graphite',    thumb_url: '/finishes/glass/back-painted-frosted-glass-graphite.webp' },
  { id: 'back-painted-sandstone-gloss',           name: 'Back Painted Sandstone Gloss',           thumb_url: '/finishes/glass/back-painted-sandstone-gloss.webp' },
  { id: 'back-painted-pebble-gloss',              name: 'Back Painted Pebble Gloss',              thumb_url: '/finishes/glass/back-painted-pebble-gloss.webp' },
  { id: 'fluted-glass-vanilla-matt',              name: 'Fluted Glass Vanilla Matt',              thumb_url: '/finishes/glass/fluted-glass-vanilla-matt.webp' },
  { id: 'fluted-glass-coffee-matt',               name: 'Fluted Glass Coffee Matt',               thumb_url: '/finishes/glass/fluted-glass-coffee-matt.webp' },
  { id: 'fluted-glass-onyx-matt',                 name: 'Fluted Glass Onyx Matt',                 thumb_url: '/finishes/glass/fluted-glass-onyx-matt.webp' },
  { id: 'fluted-glass-snow-gloss',                name: 'Fluted Glass Snow Gloss',                thumb_url: '/finishes/glass/fluted-glass-snow-gloss.webp' },
  { id: 'fluted-glass-caramel-gloss',             name: 'Fluted Glass Caramel Gloss',             thumb_url: '/finishes/glass/fluted-glass-caramel-gloss.webp' },
  { id: 'fluted-glass-black-gloss',               name: 'Fluted Glass Black Gloss',               thumb_url: '/finishes/glass/fluted-glass-black-gloss.webp' },
  { id: 'sandwich-glass-bronze-veil',             name: 'Sandwich Glass Bronze Veil',             thumb_url: '/finishes/glass/sandwich-glass-bronze-veil.webp' },
  { id: 'sandwich-glass-bronze-grid',             name: 'Sandwich Glass Bronze Grid',             thumb_url: '/finishes/glass/sandwich-glass-bronze-grid.webp' },
  { id: 'fluted-glass-ridge',                     name: 'Fluted Glass Ridge',                     thumb_url: '/finishes/glass/fluted-glass-ridge.webp' },
  { id: 'frosted-glass-mist',                     name: 'Frosted Glass Mist',                     thumb_url: '/finishes/glass/frosted-glass-mist.webp' },
  { id: 'fluted-glass-fine-ridge',                name: 'Fluted Glass Fine Ridge',                thumb_url: '/finishes/glass/fluted-glass-fine-ridge.webp' },
  { id: 'textured-glass-glacier',                 name: 'Textured Glass Glacier',                 thumb_url: '/finishes/glass/textured-glass-glacier.webp' },
  { id: 'clear-glass',                            name: 'Clear Glass',                            thumb_url: '/finishes/glass/clear-glass.webp' },
  { id: 'black-tinted-glass',                     name: 'Black Tinted Glass',                     thumb_url: '/finishes/glass/black-tinted-glass.webp' },
  { id: 'clear-fluted-glass',                     name: 'Clear Fluted Glass',                     thumb_url: '/finishes/glass/clear-fluted-glass.webp' },
  { id: 'back-painted-fluted-glass-ivory',        name: 'Back Painted Fluted Glass Ivory',        thumb_url: '/finishes/glass/back-painted-fluted-glass-ivory.webp' },

];

export const GOLA_COLORS = [
  // TODO — no real Gola color reference images supplied yet. Temporarily
  // reusing the cabinet swatches as placeholders, same as skirting/open-shelf
  // below. Replace with real Gola catalog entries, same shape:
  // { id: 'slug-id', name: 'Display Name', thumb: '/finishes/gola/slug-id.webp' },
  
  { id: 'anodized-silver-as', name: 'Anodized Silver (AS)', thumb_url: '/finishes/gola/anodized-silver-as.webp' },
  { id: 'anthracite-at',      name: 'Anthracite (AT)',      thumb_url: '/finishes/gola/anthracite-at.webp' },
  { id: 'black-ab',           name: 'Black (AB)',           thumb_url: '/finishes/gola/black-ab.webp' },
  { id: 'black-mb',           name: 'Black (MB)',           thumb_url: '/finishes/gola/black-mb.webp' },
  { id: 'brushed-gold-bg',    name: 'Brushed Gold (BG)',    thumb_url: '/finishes/gola/brushed-gold-bg.webp' },
  { id: 'silver-ss',          name: 'Silver (SS)',          thumb_url: '/finishes/gola/silver-ss.webp' },
  { id: 'special-finish-sf',  name: 'Special Finish (SF)',  thumb_url: '/finishes/gola/special-finish-sf.webp' },

];

export const SKIRTING_COLORS = [
  // TODO — 10 skirting colors, no reference images supplied yet.
  // { id: 'slug-id', name: 'Display Name', thumb: '/finishes/skirting/slug-id.webp' },
  { id: 'anthracite',             name: 'Anthracite',             thumb_url: '/finishes/skirting/anthracite.webp' },
  { id: 'black',                  name: 'Black',                  thumb_url: '/finishes/skirting/black.webp' },
  { id: 'brushed-gold',           name: 'Brushed Gold',           thumb_url: '/finishes/skirting/brushed-gold.webp' },
  { id: 'brushed-special-finish', name: 'Brushed Special Finish', thumb_url: '/finishes/skirting/brushed-special-finish.webp' },
  { id: 'grey',                   name: 'Grey',                   thumb_url: '/finishes/skirting/grey.webp' },
  { id: 'silver',                 name: 'Silver',                 thumb_url: '/finishes/skirting/silver.webp' },
  { id: 'white',                  name: 'White',                  thumb_url: '/finishes/skirting/white.webp' },

];

export const OPEN_SHELF_COLORS = [
  // TODO — 6 open-shelf colors, no reference images supplied yet.
  // { id: 'slug-id', name: 'Display Name', thumb: '/finishes/open-shelf/slug-id.webp' },
  { id: 'marsh-bank-gloss',          name: 'Marsh Bank Gloss',          thumb_url: '/finishes/cabinet/marsh-bank-gloss.webp' },
  { id: 'industrial-bay-matte',      name: 'Industrial Bay Matte',      thumb_url: '/finishes/cabinet/industrial-bay-matte.webp' },
  { id: 'courtyard-clay-gloss',        name: 'Courtyard Clay Gloss',        thumb_url: '/finishes/cabinet/courtyard-clay-gloss.webp' },
  { id: 'tuscan-oak',                name: 'Tuscan Oak',                thumb_url: '/finishes/cabinet/tuscan-oak.webp' },
  { id: 'peruvian-walnut',           name: 'Peruvian Walnut',           thumb_url: '/finishes/cabinet/peruvian-walnut.webp' },
  { id: 'desert-dune',               name: 'Desert Dune',               thumb_url: '/finishes/cabinet/desert-dune.webp' },

];

// ─────────────────────────────────────────────────────────────────────────
// Field → option-pool wiring. This is the one place that encodes the rule
// "upper cabinet & tall tower can be a cabinet color OR a glass color".
//
// Order here matches the printed order on the "Kitchen Color Finishes
// Used" slide background (Finishes_image.jpg): Lower Cabinet, Upper
// Cabinet, Loft Unit, Glass Color, Gola Color, Skirting Color, Open Shelf,
// Tall Tower.
//
// Every stored value is a composite "<category>:<id>" string (e.g.
// "cabinet:abyss-edge" or "glass:clear-glass") so the backend always knows
// which asset folder to pull the swatch from, even for the combined pools.
// ─────────────────────────────────────────────────────────────────────────
const withCategory = (category, list) => list.map(c => ({ ...c, category, value: `${category}:${c.id}` }));

// `shortLabel` is the plain category name with no "Color" suffix — this is
// what gets printed under each swatch on the PDF slide (e.g. "Upper
// Cabinet" above "Abyss Edge"). `label` (with "Color") stays as the form
// field label in the UI.
export const KITCHEN_FINISH_FIELDS = [
  {
    key: 'lowerCabinet',
    label: 'Lower Cabinet Color',
    shortLabel: 'Lower Cabinet',
    groups: [{ label: 'Cabinet Colors', options: withCategory('cabinet', CABINET_COLORS) }],
  },
  {
    key: 'upperCabinet',
    label: 'Upper Cabinet Color',
    shortLabel: 'Upper Cabinet',
    groups: [
      { label: 'Cabinet Colors', options: withCategory('cabinet', CABINET_COLORS) },
      { label: 'Glass Colors',   options: withCategory('glass', GLASS_COLORS) },
    ],
  },
  {
    key: 'loftUnit',
    label: 'Loft Unit Color',
    shortLabel: 'Loft Unit',
    groups: [{ label: 'Cabinet Colors', options: withCategory('cabinet', CABINET_COLORS) }],
  },
  {
    key: 'glassColor',
    label: 'Glass Color',
    shortLabel: 'Glass Color',
    groups: [{ label: 'Glass Colors', options: withCategory('glass', GLASS_COLORS) }],
  },
  {
    key: 'golaColor',
    label: 'Gola Color',
    shortLabel: 'Gola Color',
    groups: [{ label: 'Gola Colors', options: withCategory('gola', GOLA_COLORS) }],
  },
  {
    key: 'skirtingColor',
    label: 'Skirting Color',
    shortLabel: 'Skirting Color',
    groups: [{ label: 'Skirting Colors', options: withCategory('skirting', SKIRTING_COLORS) }],
  },
  {
    key: 'openShelf',
    label: 'Open Shelf Color',
    shortLabel: 'Open Shelf',
    groups: [{ label: 'Open Shelf Colors', options: withCategory('cabinet', OPEN_SHELF_COLORS) }],
  },
  {
    key: 'tallTower',
    label: 'Tall Tower Color',
    shortLabel: 'Tall Tower',
    groups: [
      { label: 'Cabinet Colors', options: withCategory('cabinet', CABINET_COLORS) },
      { label: 'Glass Colors',   options: withCategory('glass', GLASS_COLORS) },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// EFFICIENT STORAGE — quick reference (see chat answer for the full version)
// ─────────────────────────────────────────────────────────────────────────
// 1. Never bundle full-resolution swatches into the JS bundle or the DB as
//    blobs. Store master images once (S3 / CDN / object storage), generate
//    a small WebP thumbnail (~160px, ~75 quality) per color for the UI.
// 2. This file (or, better, a `GET /api/finishes` endpoint backed by a
//    `finishes` DB table: id, category, name, thumb_url, master_url) is the
//    only thing the frontend needs — swatch thumbnails only, never the
//    print-quality file.
// 3. Selections are stored as tiny composite strings ("cabinet:abyss-edge"),
//    not images, in the order/quote record.
// 4. The backend only ever loads the ~7 master images a given order
//    actually selected, at PDF-generation time — not all 70-80 up front.