import { Brand, Granulation, Paint, Pigment, Staining, Transparency } from "./types";
import brandsContent from "./content/brands.json";
import paintsContent from "./content/paints.json";
import pigmentsContent from "./content/pigments.json";

export const PIGMENT_FAMILIES = [
  { name: 'Yellow', color: 'bg-yellow-400' },
  { name: 'Orange', color: 'bg-orange-500' },
  { name: 'Red', color: 'bg-red-600' },
  { name: 'Purple', color: 'bg-purple-600' },
  { name: 'Blue', color: 'bg-blue-600' },
  { name: 'Green', color: 'bg-green-600' },
  { name: 'Brown', color: 'bg-amber-900' },
  { name: 'Black', color: 'bg-gray-900' },
  { name: 'White', color: 'bg-gray-100 border border-gray-300' },
  { name: 'Metallic', color: 'bg-slate-400 bg-gradient-to-br from-slate-300 to-slate-500' },
];

export const BRANDS: Brand[] = brandsContent.items as Brand[];

export const PIGMENTS: Pigment[] = pigmentsContent.items as Pigment[];

export const PAINTS: Paint[] = paintsContent.items as Paint[];

const createGroupedLookup = <T>(items: T[], keyFn: (item: T) => string) => {
  const lookup = new Map<string, T[]>();

  for (const item of items) {
    const key = keyFn(item);
    const bucket = lookup.get(key);
    if (bucket) bucket.push(item);
    else lookup.set(key, [item]);
  }

  return lookup;
};

export const BRAND_BY_ID = new Map(BRANDS.map((brand) => [brand.id, brand] as const));
export const PIGMENT_BY_CODE = new Map(PIGMENTS.map((pigment) => [pigment.code, pigment] as const));
export const PIGMENT_FAMILY_BY_CODE = new Map(PIGMENTS.map((pigment) => [pigment.code, pigment.family] as const));
export const PIGMENTS_BY_FAMILY = createGroupedLookup(PIGMENTS, (pigment) => pigment.family);
export const PIGMENTS_BY_FAMILY_LOWERCASE = new Map(
  Array.from(PIGMENTS_BY_FAMILY.entries()).map(([family, pigments]) => [family.toLowerCase(), pigments] as const)
);
export const PAINT_BY_ID = new Map(PAINTS.map((paint) => [paint.id, paint] as const));
export const PAINTS_BY_BRAND_ID = createGroupedLookup(PAINTS, (paint) => paint.brandId);
export const PAINT_SEARCH_TEXT_BY_ID = new Map(
  PAINTS.map((paint) => [
    paint.id,
    [paint.name, paint.brandId, paint.pigmentCodes.join(' ')].join(' ').toLowerCase(),
  ] as const)
);
export const PAINT_FAMILIES_BY_ID = new Map(
  PAINTS.map((paint) => [
    paint.id,
    Array.from(
      new Set(
        paint.pigmentCodes
          .map((code) => PIGMENT_FAMILY_BY_CODE.get(code))
          .filter((family): family is string => Boolean(family))
      )
    ),
  ] as const)
);
export const PAINTS_BY_FAMILY = (() => {
  const lookup = new Map<string, Paint[]>();

  for (const paint of PAINTS) {
    const families = PAINT_FAMILIES_BY_ID.get(paint.id) ?? [];
    for (const family of families) {
      const bucket = lookup.get(family);
      if (bucket) bucket.push(paint);
      else lookup.set(family, [paint]);
    }
  }

  return lookup;
})();

export const PAINTS_BY_PIGMENT_CODE = (() => {
  const lookup = new Map<string, Paint[]>();

  for (const paint of PAINTS) {
    for (const code of paint.pigmentCodes) {
      const bucket = lookup.get(code);
      if (bucket) bucket.push(paint);
      else lookup.set(code, [paint]);
    }
  }

  return lookup;
})();

export const AVAILABLE_BRANDS = BRANDS.filter((brand) => PAINTS_BY_BRAND_ID.has(brand.id));

export const getPaintMixLabel = (paint: Pick<Paint, 'pigmentMix' | 'pigmentCodes'>) =>
  paint.pigmentMix || (paint.pigmentCodes.length <= 1 ? 'Single' : 'Multi');
