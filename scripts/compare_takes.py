import json

with open("clips_transcriptions.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for clip in ["IMG_1053.MOV", "IMG_1055.MOV", "IMG_1056.MOV", "IMG_1076.MOV", "IMG_1077.MOV", "IMG_1079.MOV", "IMG_1082.MOV", "IMG_1084.MOV", "IMG_1086.MOV", "IMG_1088.MOV", "IMG_1092.MOV", "IMG_1094.MOV", "IMG_1095.MOV"]:
    print(f"\n*** {clip} ***")
    print(data.get(clip, {}).get("full_text"))
    for seg in data.get(clip, {}).get("segments", []):
        print(f"   [{seg['start']:.2f} - {seg['end']:.2f}]: {seg['text']}")
