import json

def main():
    path = "src/data/stations.json"
    try:
        with open(path, "r", encoding="utf-8") as f:
            stations = json.load(f)
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    print(f"Initial stations count: {len(stations)}")

    # 1. Apply corrections to existing stations
    for s in stations:
        # Fix "구회의사당" -> "국회의사당"
        if s["id"] == "구회의사당" or s["name"] == "구회의사당":
            s["id"] = "국회의사당"
            s["name"] = "국회의사당"
            print("Fixed: 구회의사당 -> 국회의사당")
            
        # Fix "영등포 구청" -> "영등포구청"
        if s["id"] == "영등포-구청" or s["name"] == "영등포 구청":
            s["id"] = "영등포구청"
            s["name"] = "영등포구청"
            print("Fixed: 영등포 구청 -> 영등포구청")

    # 2. Check if missing stations are already present, if not add them
    names_in_db = {s["name"] for s in stations}
    
    missing_to_add = [
        {
            "id": "여의나루",
            "name": "여의나루",
            "lines": ["5호선"],
            "lat": 37.52706,
            "lng": 126.93281
        },
        {
            "id": "마포",
            "name": "마포",
            "lines": ["5호선"],
            "lat": 37.53972,
            "lng": 126.94611
        },
        {
            "id": "중앙보훈병원",
            "name": "중앙보훈병원",
            "lines": ["9호선"],
            "lat": 37.528807,
            "lng": 127.148488
        }
    ]

    for item in missing_to_add:
        if item["name"] not in names_in_db:
            stations.append(item)
            print(f"Added missing station: {item['name']}")
        else:
            print(f"Station already exists: {item['name']}")

    # 3. Sort alphabetically by name
    stations.sort(key=lambda x: x["name"])

    # 4. Save back
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(stations, f, ensure_ascii=False, indent=2)
        print(f"Saved {len(stations)} stations to {path} successfully.")
    except Exception as e:
        print(f"Error writing file: {e}")

if __name__ == '__main__':
    main()
