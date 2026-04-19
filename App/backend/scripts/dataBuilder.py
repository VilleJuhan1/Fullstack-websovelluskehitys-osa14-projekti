import requests
import json

URL = "https://studies.cs.helsinki.fi/restcountries/api/all"

# This helper script fetches country data from the REST Countries API and saves it to a local JSON file.
def main():
    response = requests.get(URL)
    response.raise_for_status()  # raises error if request failed
    
    countries = response.json()

    filtered = []
    for country in countries:
        name = country.get("name", {}).get("common")
        region = country.get("region")
        flag = country.get("flags", {}).get("png")

        if name and flag:
            filtered.append({
                "name": name,
                "region": region,
                "flag": flag
            })

    with open("../src/data/countries.json", "w", encoding="utf-8") as f:
        json.dump(filtered, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(filtered)} countries to countries.json")

if __name__ == "__main__":
    main()