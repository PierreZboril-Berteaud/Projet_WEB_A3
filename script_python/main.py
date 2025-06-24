import pandas as pd
from sqlalchemy import create_engine, text

engine = create_engine('postgresql+psycopg2://username:password@localhost:5432/nom_base')
conn = engine.connect()

data = pd.read_csv("C:/export_IA.csv")

data = data[['MMSI','BaseDateTime','LAT','LON','SOG','COG','Heading','VesselName','Status','Length','Width','Draft']]
data['BaseDateTime'] = pd.to_datetime(data['BaseDateTime'])
data = data.sort_values(by=['MMSI', 'BaseDateTime'])