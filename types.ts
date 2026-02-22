export enum Transparency {
  Opaque = 'Opaque',
  SemiOpaque = 'Semi-Opaque',
  SemiTransparent = 'Semi-Transparent',
  Transparent = 'Transparent'
}

export enum Staining {
  NonStaining = 'Non-Staining',
  LowStaining = 'Low-Staining',
  MediumStaining = 'Medium-Staining',
  HighStaining = 'High-Staining'
}

export enum Granulation {
  None = 'None',
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export interface Pigment {
  code: string;
  name: string;
  family: string; // e.g., "Blue", "Red"
  description?: string;
  toxicity?: string;
  isDiscontinued?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
}

export interface Paint {
  id: string;
  brandId: string;
  name: string;
  pigmentCodes: string[];
  hex: string;
  transparency: Transparency;
  staining: Staining;
  granulation: Granulation;
  lightfastness: string; // e.g., "I", "II"
  isVegan: boolean;
  isDiscontinued?: boolean;
  series?: string;
  
  // New fields for expanded table
  paintNumber?: string;
  swatchImage?: string; // URL to professional swatch image
  stainingVsLifting?: string; // Descriptive text e.g. "Easy to lift"
  flow?: string; // e.g. "High", "Medium"
  tintingStrength?: string; // e.g. "High", "Medium"
  performance?: string; // e.g. "Professional", "Student"
  toxicity?: string; // e.g. "A", "C", "Prop 65"
  collection?: string; // e.g. "PrimaTek", "Professional Water Colour"
}

export interface ComparisonContextType {
  selectedPaintIds: string[];
  togglePaint: (id: string) => void;
  clearSelection: () => void;
  removePaint: (id: string) => void;
}
