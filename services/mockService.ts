import { BRANDS, PAINTS, PIGMENTS, PIGMENTS_BY_FAMILY_LOWERCASE } from "../constants";
import { Brand, Paint, Pigment } from "../types";

export const getPaints = async (): Promise<Paint[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(PAINTS), 300);
  });
};

export const getBrands = async (): Promise<Brand[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(BRANDS), 200);
  });
};

export const getPigments = async (): Promise<Pigment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(PIGMENTS), 200);
  });
};

export const getPigmentByFamily = async (family: string): Promise<Pigment[]> => {
    return new Promise(resolve => {
        const normalizedFamily = family.toLowerCase();
        const pigments = PIGMENTS_BY_FAMILY_LOWERCASE.get(normalizedFamily) ?? [];
        setTimeout(() => resolve(pigments.slice()), 200);
    })
}

export const searchPaints = async (query: string): Promise<Paint[]> => {
    return new Promise(resolve => {
        const lowerQ = query.toLowerCase();
        const results = PAINTS.filter(p => 
            p.name.toLowerCase().includes(lowerQ) || 
            p.pigmentCodes.some(c => c.toLowerCase().includes(lowerQ))
        );
        setTimeout(() => resolve(results), 200);
    });
}
