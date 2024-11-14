import pandas as pd

from utils import calculate_displacement


def load_city_poi(city):
    city_file_path = f'./POIs/City{city}.csv'
    try:
        city_poi_df = pd.read_csv(city_file_path)
        return city_poi_df
    except FileNotFoundError:
        print("file not found")
        return None
    
def get_Pois(city, x, y):
    city_poi_df = load_city_poi(city)
    if city_poi_df is None:
        return []

    POI_list = []
    for _, poi in city_poi_df.iterrows():
        distance = calculate_displacement(int(x), int(y), int(poi['x']), int(poi['y']))
        POI_list.append({
            'x': poi['x'],
            'y': poi['y'],
            'category': poi['category'],
            'POI_count': poi['POI_count'],
            'distance': round((distance/2), 2)  #covert to km
        })

    POI_list = sorted(POI_list, key=lambda k: k['distance'])
    return POI_list[:10]


def get_all_POIs(city):
    city_poi_df = load_city_poi(city)
    if city_poi_df is None:
        return []

    return city_poi_df.to_dict(orient='records')