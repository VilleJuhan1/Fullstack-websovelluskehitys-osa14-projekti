import json
from urllib.parse import quote

# Hardcoded dataset of the core 46 Hiragana and 46 Katakana basic characters (Generated with Gemini 3.5 Flash)
KANA_DATASET = {
    "hiragana": {
        "a": "あ", "i": "い", "u": "う", "e": "え", "o": "お",
        "ka": "か", "ki": "き", "ku": "く", "ke": "け", "ko": "こ",
        "sa": "さ", "shi": "し", "su": "す", "se": "せ", "so": "そ",
        "ta": "た", "chi": "ち", "tsu": "つ", "te": "て", "to": "と",
        "na": "な", "ni": "に", "nu": "ぬ", "ne": "ね", "no": "の",
        "ha": "は", "hi": "ひ", "fu": "ふ", "he": "he", "ho": "ほ",
        "ma": "ま", "mi": "み", "mu": "む", "me": "め", "mo": "mo",
        "ya": "や", "yu": "ゆ", "yo": "よ",
        "ra": "ら", "ri": "り", "ru": "る", "re": "れ", "ro": "ろ",
        "wa": "わ", "wo": "を", "n": "ん"
    },
    "katakana": {
        "a": "ア", "i": "イ", "u": "ウ", "e": "エ", "o": "オ",
        "ka": "カ", "ki": "キ", "ku": "ク", "ke": "ケ", "ko": "コ",
        "sa": "サ", "shi": "シ", "su": "ス", "se": "セ", "so": "ソ",
        "ta": "タ", "chi": "チ", "tsu": "ツ", "te": "テ", "to": "ト",
        "na": "ナ", "ni": "ニ", "nu": "ヌ", "ne": "ネ", "no": "ノ",
        "ha": "ハ", "hi": "ヒ", "fu": "フ", "he": "ヘ", "ho": "ホ",
        "ma": "マ", "mi": "ミ", "mu": "ム", "me": "メ", "mo": "モ",
        "ya": "ヤ", "yu": "ユ", "yo": "ヨ",
        "ra": "ラ", "ri": "リ", "ru": "ル", "re": "レ", "ro": "ロ",
        "wa": "ワ", "wo": "ヲ", "n": "ン"
    }
}

# As the app depends on image urls, generate one with Google Fonts for each character
def generate_kana_data_url(character: str) -> str:
    svg_template = f"""
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&amp;display=swap');
        .text {{ font-family: 'Noto Sans JP', sans-serif; font-size: 110px; fill: #081e24; }}
      </style>
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" class="text">{character}</text>
    </svg>
    """.strip()
    return f"data:image/svg+xml;utf8,{quote(svg_template)}"

# Build the static dataset and save it as a JSON file
def build_static_database():
    print("Generating local Kana dataset ...")
    kana_dataset = []
    i = 0
    
    for category, core_kana in KANA_DATASET.items():
        for romaji, char in core_kana.items():
            i += 1
            kana_dataset.append({
                "id": i,
                "name": romaji,
                "categories": [category],
                "imageUrl": generate_kana_data_url(char),
                "translations": {
                    "jpn": char
                }
            })
            
    output_filename = "../src/data/kana.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        json.dump(kana_dataset, f, ensure_ascii=False, indent=2)
        
    if len(kana_dataset) != 92:
        print(f"Error: {len(kana_dataset)} records generated. Expected 92.")
        exit(1)
    else:
        print(f"Successfully generated {len(kana_dataset)} records in {output_filename}!")
        exit()

if __name__ == "__main__":
    build_static_database()