import requests
import json

# This helper function fetches country data from the REST Countries API and saves it to a local JSON file.
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
                "categories": [obj.get("region")], # only one region in this api
                "imageUrl": obj.get("flags", {}).get("png")
            })
        except Exception as e:
            print(f"Error processing object: {e}")

    with open("../src/data/countries.json", "w", encoding="utf-8") as f:
        json.dump(filtered, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(filtered)} countries to countries.json")

def pokemonDataBuilder():
    pokemons = 151 # Generate data for the original 151 pokemon

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
                "categories": [t["type"]["name"] for t in pokemonData.get("types", {})] # returns list of types for this pokemon
            })
        except Exception as e:
            print(f"Error processing object: {e}")

    with open("../src/data/pokemon.json", "w", encoding="utf-8") as f:
        json.dump(filtered, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(filtered)} pokemon to pokemon.json")

if __name__ == "__main__":
    #countryDataBuilder()
    pokemonDataBuilder()