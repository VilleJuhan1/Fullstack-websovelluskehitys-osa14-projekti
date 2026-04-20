// models/country.ts
export interface Country {
  name: string;
  translation: string;
  region: string;
  flag: string;
  population?: number;
  capital?: string;
}
