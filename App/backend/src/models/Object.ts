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
    name: string; // Identifier, like Pikachu or Finland
    translations: Translations;
    category: string; // Category, like water-type for Pokemon or Europe for countries
    image: string; // Image of the object

    constructor(name: string, translations: Translations, category: string, image: string) {
        this.name = name;
        this.translations = translations;
        this.category = category;
        this.image = image;
    }
}