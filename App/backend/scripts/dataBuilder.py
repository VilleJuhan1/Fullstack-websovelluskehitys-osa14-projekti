import requests
import json
from japaneseDataBuilder import build_static_database as kanaDataBuilder

# This helper function fetches country data from the REST Countries API and saves it to a local JSON file.

def dotaHeroDataBuilder():
    URL = "https://api.opendota.com/api/heroStats"
    imageBaseURL = "https://cdn.cloudflare.steamstatic.com"
    response = requests.get(URL)
    response.raise_for_status() # raises error if request failed

    data = response.json()
    #print(data[0])
    #return

    filtered = []
    id = 1
    for obj in data:
        try:
            filtered.append({
                "id": id,
                "name": obj["localized_name"],
                "imageUrl": imageBaseURL + obj["img"],
                "categories": [obj["primary_attr"]],
            })
            id += 1
            print(f"Hero {id} added: {obj['localized_name']}")
        except Exception as e:
            print(f"Error processing object: {e}")

    with open("../src/data/dotaHeroes.json", "w", encoding="utf-8") as f:
        json.dump(filtered, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(filtered)} heroes to dotaHeroes.json")

def countryDataBuilder():
    URL = "https://restcountries.com/v3.1/all?fields=name,translations,flags,region"
    response = requests.get(URL)
    response.raise_for_status()  # raises error if request failed

    data = response.json()

    filtered = []
    id = 1
    for obj in data:
        try:
            filtered.append({
                "id": id,
                "name": obj.get("name", {}).get("common"),
                "translations": {
                    "fin": obj.get("translations", {}).get("fin", {}).get("common"),
                    "swe": obj.get("translations", {}).get("swe", {}).get("common")
                },
                "categories": [obj.get("region")],  # only one region in this api
                "imageUrl": obj.get("flags", {}).get("png")
            })
        except Exception as e:
            print(f"Error processing object: {e}")

    with open("../src/data/countries.json", "w", encoding="utf-8") as f:
        json.dump(filtered, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(filtered)} countries to countries.json")

# This helper function fetches pokemon data from the PokeAPI and saves it to a local JSON file.


def pokemonDataBuilder():
    pokemons = 151  # Generate data for the original 151 pokemon

    filtered = []
    for i in range(1, pokemons + 1):
        pokemonDataUrl = f"https://pokeapi.co/api/v2/pokemon/{i}"
        pokemonDataResponse = requests.get(pokemonDataUrl)
        pokemonDataResponse.raise_for_status()  # raises error if request failed
        pokemonData = pokemonDataResponse.json()
        try:
            filtered.append({
                "id": i,
                "name": pokemonData.get("name"),
                "imageUrl": pokemonData.get("sprites", {}).get("front_default"),
                # returns list of types for this pokemon <- Maybe change this later to use for different generations.
                "categories": [t["type"]["name"] for t in pokemonData.get("types", {})]
            })
        except Exception as e:
            print(f"Error processing object: {e}")

    with open("../src/data/pokemon.json", "w", encoding="utf-8") as f:
        json.dump(filtered, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(filtered)} pokemon to pokemon.json")


def expandedPokemonDataBuilder():
    pokemons = 1025  # Generate data for all pokemon
    generations = [
        [151, "1996 Red/Blue"],
        [251, "1999 Gold/Silver"],
        [386, "2002 Ruby/Sapphire"],
        [493, "2006 Diamond/Pearl"],
        [649, "2010 Black/White"],
        [721, "2013 X/Y"],
        [809, "2016 Sun/Moon"],
        [905, "2019 Sword/Shield"],
        [1025, "2022 Scarlet/Violet"]
    ]

    filtered = []
    for i in range(1, pokemons + 1):
        pokemonDataUrl = f"https://pokeapi.co/api/v2/pokemon/{i}"
        pokemonDataResponse = requests.get(pokemonDataUrl)
        pokemonDataResponse.raise_for_status()  # raises error if request failed
        pokemonData = pokemonDataResponse.json()
        gen = None
        for gen in generations:
            if i <= gen[0]:
                gen = gen[1]
                break
        try:
            filtered.append({
                "id": i,
                "name": pokemonData.get("name"),
                "imageUrl": pokemonData.get("sprites", {}).get("front_default"),
                # returns list of types for this pokemon <- Maybe change this later to use for different generations.
                "categories": [f"{gen}"]
            })
        except Exception as e:
            print(f"Error processing object: {e}")
        print(f"Pokemon {i} added: {pokemonData.get('name')}, Gen: {gen}")

    with open("../src/data/pokemonAll.json", "w", encoding="utf-8") as f:
        json.dump(filtered, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(filtered)} pokemon to pokemonAll.json")


if __name__ == "__main__":
    # countryDataBuilder()
    # pokemonDataBuilder()
    # expandedPokemonDataBuilder()
    # dotaHeroDataBuilder()
    kanaDataBuilder()
    print("Done")
