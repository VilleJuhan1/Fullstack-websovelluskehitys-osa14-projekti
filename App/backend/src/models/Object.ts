//models/Object.ts

// 
interface Translations {
    common: string;
    official: string;
    fin: string;
    swe: string;
}

// A type of object, ie. Pokemon, monument, landmark or a country.
export class ObjectType {
    id: number;
    name: string; // Identifier, like Pikachu or Finland
    translations: Translations;
    categories: string[]; // List of categories, like ["grass", "poison"] for Pokemon or ["Europe", "Asia"] for Turkey
    imageUrl: string; // Image of the object

    constructor(id: number, name: string, translations: Translations, categories: string[], imageUrl: string) {
        this.id = id;
        this.name = name;
        this.translations = translations;
        this.categories = categories;
        this.imageUrl = imageUrl;
    }
}