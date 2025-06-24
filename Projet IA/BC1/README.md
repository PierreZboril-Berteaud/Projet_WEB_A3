# Projet IA 

Dans ce projet, vous avez la possibilité d'utiliser plusieurs fonctionnalitées :

* `entrainement` : Entraine un modèle à partir d'un tableur avec les données de l'AIS.
* `prediction` : Effectue une prédiction pour trouver dans quel cluster se trouve un navire

## 📁 Fichiers requis

* `fonc_1.py` : script contenant les différentes fonctions.
* `main_fonc_1.py` : script contenant le script.
* `kmeans.pkl` : fichier contenant le modèle RandomForest déjà entrainé (permet d'éviter un temps d'execution trop long).
* `scaler.pkl` : fichier contenant les données numériques normalisées.
* `export_IA.csv` : fichier contenant les données de l'AIS pour entrainer le modèle (temps d'execution long).

## 📦 Dépendances

* `pandas`
* `matplotlib`
* `scikit-learn`
* `pickle`
* `argparse`

Installe-les avec :

```bash
pip install pandas matplotlib scikit-learn
```

## 🚀 Exécution

Lance le script avec :

```bash
python main_fonc_1.py [options]
```

#### Options disponibles

| Option     | Valeurs possibles        | Description                                          | Obligatoire pour prediction 
| ---------- | ------------------------ | -------------------------------------------------    | ------------------------------------------------
| `--LAT`   | valeurs entre `20` et `30`| Lattitude du navire                                  | 	✅ Oui
| `--LON`   | valeurs entre `-98` et `-78`| Longitude du navire                                | 	✅ Oui
| `--SOG` |  valeurs entre `0` et `35` | Vitesse du navire                                     | 	✅ Oui
| `--COG`     | valeurs entre `0` et `359`| Cap réel sur le sol                                | 	✅ Oui
| `--Heading`  | valeurs entre `0` et `359`| Direction du navire                               | 	✅ Oui
|`Predict` | booléen | Permet de choisir si on veut faire une prédiction                       |  ✅ Oui
|`Model` |Kmeans | permet de choisir le modèle utilisé                                         |  ✅ Oui
|`Train`| booléen | Entraine un nouveau modèle                                                 |  ❌Non  (⚠️Entraine un nouveau modèle si valeurs "True")
|`Maps` | booléen | Permet d'afficher les cartes avec les différents clusters                          |  ❌Non
|`Score` | booléen | Permet d'afficher les scores Calinski-Harabasz et Davies-Bouldin                  |  ❌Non


#### Exemples

```bash
# Execution pour prédiction du cluster lié à un navire
python main_fonc_1.py --Predict True --Model Kmeans --LAT 26.26671 --LON -83.32707 --SOG 12.7 --COG 5.4 --Heading 6

# Exécution pour l'entrainement du modèle
python main_fonc_1.py --Train True --Model Kmeans #⚠️l'entrainement d'un modèle peut prendre du temps

#Affichage des différents graphiques et maps
python main_fonc_1.py --Maps True
python main_fonc_1.py --Score True
```
```
Commandes/
├── Train/                      
│   ├── Mkeans/
|   |     |-Entraine un modèle avec Kmeans
|   |         
│   ├── Score /
|   |    |- Affiches les scores pour tout les clusters
|   ├── Maps
|   |    |- Affiche les graphiques avec les différents clusters
|   ├── Predict
|   |    |- Predit dans quel clusters se trouve un navire en fonction des données en entrée         
    
```
## 📄 Auteurs

Projet réalisé par Thomas ROULEAU, Florelle RAULIN, Pierre ZBORIL-Berteaud
