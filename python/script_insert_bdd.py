import pandas as pd
import psycopg2
from psycopg2.extras import execute_values  # pour insérer plusieurs lignes à la fois efficacement





def insert_data(db_conn, M_MSI, Nom, Longueur, Largeur, Draft, VesselType, Cargo, date, Etat, latitude, longitude, SOG,
                COG, Heading):
    try:
        with db_conn:
            with db_conn.cursor() as cur:
                # 1. Vérifier si MMSI existe
                cur.execute("SELECT MMSI FROM Bateau WHERE MMSI = %s", (M_MSI,))
                if cur.fetchone() is None:
                    # Insérer bateau
                    cur.execute("""
                        INSERT INTO Bateau (MMSI, NOM, LONGUEUR, LARGEUR, DRAFT, VesselType, Cargo)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """, (M_MSI, Nom, Longueur, Largeur, Draft, VesselType, Cargo))

                # 2. Insérer Historique et récupérer id_date
                cur.execute("""
                    INSERT INTO Historique (MMSI, BaseDateTime, VesselStatus)
                    VALUES (%s, %s, %s) RETURNING id_date
                """, (M_MSI, date, Etat))
                id_date = cur.fetchone()[0]

                # 3. Insérer Position
                cur.execute("""
                    INSERT INTO Position (MMSI, id_date, LAT, LON, SOG, COG, HEADING)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (M_MSI, id_date, latitude, longitude, SOG, COG, Heading))

        # Commit automatique avec 'with db_conn' (si autocommit off)
        print("Données insérées avec succès")
    except Exception as e:
        print("Erreur lors de l'insertion :", e)
        db_conn.rollback()


if __name__ == "__main__":
    data = pd.read_csv("../export_IA.csv")

    data = data[['MMSI', 'BaseDateTime', 'LAT', 'LON', 'SOG', 'COG', 'Heading', 'VesselName', 'VesselType', 'Length', 'Width',
         'Draft', 'Cargo', 'Status']]
    data['Cargo'] = data['Cargo'].fillna(data.groupby('VesselType')['Cargo'].transform('median'))
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="projetweba3",
            user="thomas",
            password="1234"
        )
        for index, row in data.iterrows():
            # Convertir BaseDateTime en datetime Python
            date_obj = pd.to_datetime(row['BaseDateTime'])

            insert_data(
                conn,
                M_MSI=row['MMSI'],
                Nom=row['VesselName'],
                Longueur=float(row['Length']),
                Largeur=float(row['Width']),
                Draft=float(row['Draft']),
                VesselType=int(row['VesselType']),
                Cargo=int(row['Cargo']),
                date=date_obj,
                Etat=int(row['Status']),
                latitude=float(row['LAT']),
                longitude=float(row['LON']),
                SOG=float(row['SOG']),
                COG=int(row['COG']),
                Heading=int(row['Heading'])
            )

    except Exception as e:
        print("Erreur de connexion à la BDD :", e)
    finally:
        if conn:
            conn.close()
