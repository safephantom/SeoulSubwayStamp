import urllib.request
import ast
import re
import json
import os

def main():
    print("Fetching station data from Gist...")
    url = 'https://gist.githubusercontent.com/jhj0517/9bd253175c4410493af024d5e0a1c01f/raw/38e1e6505455731a8573433115c6f6bf0464a30d/korean-subway-station-list.json5'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        with urllib.request.urlopen(req) as r:
            content = r.read().decode('utf-8')
    except Exception as e:
        print(f"Error fetching data: {e}")
        return

    print("Parsing JSON5 data...")
    # Remove single-line comments // ...
    content_no_comments = re.sub(r'//.*', '', content)
    # Remove block comments /* ... */
    content_no_comments = re.sub(r'/\*.*?\*/', '', content_no_comments, flags=re.DOTALL)
    
    try:
        raw_data = ast.literal_eval(content_no_comments.strip())
    except Exception as e:
        print(f"Error parsing JSON5/AST: {e}")
        return

    print(f"Total stations found in Gist: {len(raw_data)}")
    
    # Filter for Seoul Metropolitan area
    seoul_stations = [s for s in raw_data if s.get('city') == '서울']
    print(f"Seoul Metropolitan stations: {len(seoul_stations)}")

    # Clean and structure the data
    cleaned_stations = []
    seen_ids = set()

    for idx, station in enumerate(seoul_stations):
        raw_name = station.get('name', '')
        
        # Strip trailing '역' as requested
        if raw_name.endswith('역'):
            name = raw_name[:-1]
        else:
            name = raw_name
            
        lat = station.get('lat')
        lng = station.get('lng')
        lines = station.get('lines', [])
        
        if not name or lat is None or lng is None:
            continue
            
        # Create a unique ID
        # Convert spaces to hyphens and make it url safe
        base_id = name.replace(" ", "-").replace("(", "").replace(")", "")
        # If there are duplicate names (e.g. Yangpyeong), append line details to make ID unique
        station_id = base_id
        counter = 1
        while station_id in seen_ids:
            station_id = f"{base_id}-{'-'.join(lines).replace('호선', '')}-{counter}"
            counter += 1
            
        seen_ids.add(station_id)
        
        cleaned_stations.append({
            "id": station_id,
            "name": name,
            "lines": lines,
            "lat": float(lat),
            "lng": float(lng)
        })

    # Sort by name
    cleaned_stations.sort(key=lambda x: x['name'])

    # Write output directory if not exists
    os.makedirs(os.path.join("src", "data"), exist_ok=True)
    output_path = os.path.join("src", "data", "stations.json")
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(cleaned_stations, f, ensure_ascii=False, indent=2)
        
    print(f"Saved {len(cleaned_stations)} stations to {output_path} successfully!")

if __name__ == '__main__':
    main()
