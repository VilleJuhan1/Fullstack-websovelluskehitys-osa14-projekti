//models/Object.ts

export interface Translations {
  common?: string;
  official?: string;
  fin?: string;
  swe?: string;
  jpn?: string;
}

/**
 * Generic type object class that can be used in the quiz game.
 * Used by Pokemon, Countries, Kana and Dota heroes types.
 */
export class ObjectType {
  id: number;
  name: string; // Identifier, like Pikachu or Finland
  translations: Translations;
  categories: string[]; // List of categories, like ["grass", "poison"] for Pokemon or ["Europe", "Asia"] for Turkey
  imageUrl: string; // Image of the object

  constructor(
    id: number,
    name: string,
    translations: Translations,
    categories: string[],
    imageUrl: string
  ) {
    this.id = id;
    this.name = name;
    this.translations = translations;
    this.categories = categories;
    this.imageUrl = imageUrl;
  }
}
