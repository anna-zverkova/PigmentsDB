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
