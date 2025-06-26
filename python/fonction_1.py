
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.cluster import DBSCAN
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from sklearn.metrics import silhouette_score, calinski_harabasz_score, davies_bouldin_score
import plotly.graph_objects as go
from sklearn.preprocessing import StandardScaler
import pickle,warnings,argparse

def nettoyage_donnees_AIS(emplacement_file):
    # Recuperation des donnees
    data = pd.read_csv(emplacement_file)

    # On garde seulement les donnees importantes
    data = data[
        ['BaseDateTime', 'LAT', 'LON', 'SOG', 'COG', 'Heading', 'VesselName', 'VesselType', 'Status', 'Length', 'Width',
         'Draft', 'Cargo']]
    data.info(verbose=True)

    print("Nombre de donnees manquantes dans Cargo : ", data['Cargo'])
    data['Cargo'] = data.groupby('VesselType')['Cargo'].transform(lambda x: x.fillna(x.median()))
    data.info(verbose=True)

    print("Donnees manquantes dans data :", data)

    return data

def division_donnees(data, train_set_ratio):
    train_set, test_set = train_test_split(data, train_size=train_set_ratio, random_state=42)
    return train_set, test_set

def dbscan(data):
    """Applique l'algorithme DBSCAN sur des données géospatiales de navires et visualise les résultats."""
    
    print("start Dbscan")  # Message de début du traitement
    
    # Sélection des caractéristiques pour le clustering :
    X = data[['LON', 'LAT', 'SOG', 'COG', 'Heading']].values  # Conversion en array numpy
    # Initialisation du modèle DBSCAN avec :
    dbscan = DBSCAN(eps=1, min_samples=10)
    dbscan.fit(X)  # Application de l'algorithme sur les données
    print("End Dbscan")  # Message de fin du traitement
    
    # Ajout des labels de cluster au DataFrame original
    data['Cluster'] = dbscan.labels_
    
    #Calcul le score pour chaque méthode pour le k-ième cluster
    if len(set(dbscan.labels_)) > 1:
        silhouette_avg = silhouette_score(X, dbscan.labels_)
        calinski = calinski_harabasz_score(X, dbscan.labels_)
        davies = davies_bouldin_score(X, dbscan.labels_)
        
        print(f"Silhouette Score: {silhouette_avg}")
        print(f"Calinski-Harabasz Score: {calinski}")
        print(f"Davies-Bouldin Score: {davies}")
    else:
        print("Only one cluster found - cannot compute metrics")
    
    # Création d'une map interactive avec Mapbox
    fig = go.Figure()
    
    # Ajout de chaque cluster comme une couche distincte
    for cluster_label in sorted(data['Cluster'].unique()):
        # Filtrage des données pour le cluster courant
        cluster_data = data[data['Cluster'] == cluster_label]
        
        fig.add_trace(
            go.Scattermapbox(
                lat=cluster_data['LAT'],lon=cluster_data['LON'],mode='markers',marker=dict(
                    size=8,  # Taille des marqueurs
                    # Couleur selon le cluster (gris pour le bruit = -1)
                    color=cluster_label if cluster_label >= 0 else 'gray',
                    colorscale='Viridis',  # Palette de couleurs
                ),
                # Nom du cluster (ou "Noise" pour le bruit)
                name=f'Cluster {cluster_label}' if cluster_label >= 0 else 'Noise',
                text=cluster_data['VesselName'] if 'VesselName' in cluster_data.columns else None,
                hoverinfo='text+lon+lat'  # Infos affichées au survol
            )
        )

    # Configuration de la mise en page de la carte
    fig.update_layout(
        title="DBSCAN carte des clusters",
        mapbox=dict(
            style='open-street-map',  # Style de carte
            center=dict(             # Centrage sur la moyenne des coordonnées
                lat=data['LAT'].mean(),
                lon=data['LON'].mean()
            ),
            zoom=5  # Niveau de zoom initial
        ),
        margin={"r":0,"t":30,"l":0,"b":0}
    )

    fig.show()  # Affichage de la carte interactive
    
    # Création d'une visualisation statique avec matplotlib
    plt.figure(figsize=(10, 8))
    scatter = plt.scatter(data['LON'], data['LAT'], c=data['Cluster'], cmap='viridis')
    plt.xlabel('Longitude')
    plt.ylabel('Latitude')
    plt.colorbar(scatter, label='Cluster')
    plt.title('DBSCAN Clustering (Static View)')
    plt.show()
    
    return data  # Retourne les données avec les clusters ajoutés

def Kmeans_train(data, k):
    """
    Applique l'algorithme K-means sur des données géospatiales de navires.
    
    Args:
        data (DataFrame): DataFrame contenant les données des navires
        k (int): Nombre de clusters à créer
        
    Returns:
        tuple: (DataFrame avec labels de cluster)
    """
    
    # Sélection des caractéristiques pour le clustering :
    X = data[['LON', 'LAT', 'SOG', 'COG', 'Heading']]
    #Kmeans_score(data,7)
    print("Start K-means")  # Message de début du traitement
    
    # Normalisation des données
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)  # Standardisation (moyenne=0, écart-type=1)
    X_scaled = pd.DataFrame(X_scaled, columns=X.columns)  # Reconversion en DataFrame
    with open('../model/scaler_kmeans.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    
    # Initialisation et entraînement du modèle K-means :
    # n_clusters=k : nombre de clusters souhaités
    # random_state=0 : reproductibilité des résultats
    # max_iter=1200 : nombre max d'itérations pour la convergence
    kmeans = KMeans(n_clusters=k, random_state=0, max_iter=1200)
    kmeans.fit(X_scaled)  # Application de l'algorithme

    # Sauvegarde du modèle entraîné dans un fichier pickle
    with open('../model/kmeans.pkl', 'wb') as f:
        pickle.dump(kmeans, f)

    print("End K-means")  # Message de fin du traitement
    
    # Ajout des labels de cluster au DataFrame original
    data['Cluster'] = kmeans.labels_
        
    # Visualisation des résultats
    #Kmeans_plot(data, X_scaled, k)
    #Kmeans_map(data, k)
    return data,X_scaled  # Retour des données labellisées et des centroïdes

def Kmeans_plot(data,X_scaled,k):
    plt.figure(figsize=(10, 8))
    scatter = plt.scatter(X_scaled['LON'], X_scaled['LAT'], c=data['Cluster'], cmap='viridis')

    plt.xlabel('Longitude (normalisée)')
    plt.ylabel('Latitude (normalisée)')
    plt.title(f'K-Means Clustering of Vessel Locations (k={k})')
    plt.colorbar(scatter, label='Cluster')
    plt.show()
    for i in range(3):
        cluster_i_data = data[data['Cluster'] == i]

        # SOG
        plt.hist(cluster_i_data['SOG'], bins=20, color='blue', edgecolor='black')
        plt.title(f'Histogramme de SOG pour Cluster {i}')
        plt.xlabel('SOG')
        plt.ylabel('Fréquence')
        plt.show()

        plt.hist(cluster_i_data['VesselType'], bins=20, color='blue', edgecolor='black')
        plt.title(f'Histogramme de VesselType pour Cluster {i}')
        plt.xlabel('VesselType')
        plt.ylabel('Fréquence')
        plt.show()

        # COG
        plt.hist(cluster_i_data['COG'], bins=20, color='blue', edgecolor='black')
        plt.title(f'Histogramme de COG pour Cluster {i}')
        plt.xlabel('COG')
        plt.ylabel('Fréquence')
        plt.show()

        # Heading
        plt.hist(cluster_i_data['Heading'], bins=20, color='blue', edgecolor='black')
        plt.title(f'Histogramme de Heading pour Cluster {i}')
        plt.xlabel('Heading')
        plt.ylabel('Fréquence')
        plt.show()

        mean_cluster_i = data[data['Cluster'] == i][['LON', 'LAT', 'SOG', 'COG', 'Heading']].mean()
        print(f"pour le cluster {i} \n {mean_cluster_i}")

def Kmeans_score(data, k):
    global kmeans
    
    # Sélection des caractéristiques pour le clustering :
    # Longitude, Latitude, Speed Over Ground, Course Over Ground et Heading
    X = data[['LON', 'LAT', 'SOG', 'COG', 'Heading']]

    for i in range(k):

        print(f"Start K-means :{k}")
         # Normalisation des données
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)  # Standardisation (moyenne=0, écart-type=1)
        X_scaled = pd.DataFrame(X_scaled, columns=X.columns)  # Reconversion en DataFrame
        
        # Initialisation et entraînement du modèle K-means :
        # n_clusters=k : nombre de clusters souhaités
        # random_state=0 : reproductibilité des résultats
        # max_iter=1200 : nombre max d'itérations pour la convergence
        kmeans = KMeans(n_clusters=k, random_state=0, max_iter=1200)
        kmeans.fit(X_scaled)
        #initialisation des listes de scores
        calinski=[]
        davies =[]
        silhouette_avg = []

        #Calcul le score pour chaque méthode pour le k-ième cluster
        silhouette_avg = silhouette_score(X_scaled, kmeans.labels_)
        calinski = calinski_harabasz_score(X_scaled, kmeans.labels_)
        davies = davies_bouldin_score(X_scaled, kmeans.labels_)

        print(f"Silhouette score : {silhouette_avg:.3f}")
        print(f"Calinski-Harabasz Index : {calinski:.2f}")
        print(f"Davies-Bouldin Index : {davies:.3f}")

        print(f"End K-means")
        # Ajout des labels de cluster au DataFrame original
        data['Cluster'] = kmeans.labels_

    return data

def Kmeans_map(data, k):
    # Créer la carte Plotly Mapbox avec les clusters
    fig = go.Figure()

    # Ajouter un Scattermapbox par cluster
    for cluster_label in sorted(data['Cluster'].unique()):
        cluster_data = data[data['Cluster'] == cluster_label]
        fig.add_trace(
            go.Scattermapbox(
                lat=cluster_data['LAT'],
                lon=cluster_data['LON'],
                mode='markers',
                marker=dict(size=8),
                name=f'Cluster {cluster_label}',
                text=cluster_data['VesselName'] if 'VesselName' in cluster_data.columns else None
            )
        )

    fig.update_layout(
        title=f"K-Means map des clusters (k={k})",
        mapbox=dict(
            style='open-street-map',
            center=dict(
                lat=data['LAT'].mean(),
                lon=data['LON'].mean()
            ),
            zoom=5
        ),
        margin={"r":0,"t":30,"l":0,"b":0}
    )

    fig.show()

    return data

def predict_kmeans(new_data,kmeans):
    y_pred = kmeans.predict(new_data)
    return y_pred

def scale_for_map(X):
    # Sélection des colonnes nécessaires
    features = ['LON', 'LAT', 'SOG', 'COG', 'Heading']
    X_subset = X[features]

    # Normalisation
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_subset)

    # Retourner un DataFrame pour plus de lisibilité
    return pd.DataFrame(X_scaled, columns=features)
