# Projet IA 

Dans ce projet, vous avez la possibilité d'utiliser plusieurs fonctionnalitées :

* `entrainement` : Entraine un modèle à partir d'un tableur avec les données de l'AIS.
* `prediction` : Effectue une prédiction de la position d'un navire en fonction des données entrées.

## 📁 Fichiers requis

* `fonc_3.py` : script contenant les différentes fonctions.
* `main_fonc_3.py` : script contenant le script.
* `modele.pkl` : fichier contenant le modèle déjà entrainé (permet d'éviter un temps d'execution trop long).
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
python main_fonc_3.py [options]
```

#### Options disponibles

| Option     | Valeurs possibles        | Description                                          | Obligatoire pour prediction 
| ---------- | ------------------------ | -------------------------------------------------    | ------------------------------------------------
| `--LAT`   | valeurs entre `20` et `30`| Lattitude du navire                                  | 	✅ Oui
| `--LON`   | valeurs entre `-98` et `-78`| Longitude du navire                                | 	✅ Oui
| `--SOG` |  valeurs entre `0` et `35` | Vitesse du navire                                     | 	✅ Oui
| `--COG`     | valeurs entre `0` et `359`| Cap réel sur le sol                                | 	✅ Oui
| `--Heading`  | valeurs entre `0` et `359`| Direction du navire                               | 	✅ Oui
| `--VesselType` | valeurs entre `60` et `89`| Type du navire                                  | 	✅ Oui
|`--Length` | valeurs supérieurs à `10`| Longueur du navire                                    | 	✅ Oui
|`Width` | valeurs supérieurs à `3`| Largeur du navire                                         | 	✅ Oui
|`Draft`| valeurs supérieurs à `0.5`| Profondeur du navire                                     | 	✅ Oui
|`Cargo`| valeurs entre `49` et `90` | Type de cargaison du navire                             | 	✅ Oui
|`time`| valeurs supérieurs à `0`| Temps en secondes à prédire                                 | 	✅ Oui
|`VesselName`| Nom d'un navire "exemple" | Navire pour lequel on veut faire des pédictions     |    ❌ Non
|`Train`| "True" si on veut entrainer le modèle | Entraine un nouveau modèle                   |    ❌Non  (⚠️Entraine un nouveau modèle si valeurs "True")
#### Exemples

```bash
# Execution pour prédiction sur un navire 
python main_fonc_3.py --LAT 29.72289 --LON -95.23584 --SOG 0.0 --COG 0.0 --Heading 0 --VesselType 80 --Length 183 --Width 28.0 --Draft 10.0 --Cargo 83 --time 183 

# Exécution pour la prédiction sur un nom de navire ("all" permet d'afficher toutes les prédictions, cela peut prendre beaucoup de temps) 
python main_fonc_3.py --VesselName "Nom du navire"

# Exécution pour l'entrainement du modèle
python main_fonc_3.py --Train "True"
```

La fonction de prédiction par VesselName, vous renvoie deux graphiques, les deux permettent de voir la différence entre les valeurs prédites et les valeurs attendues.

La fonction "--Train" entrain un modèle avec la regression RandomForest, pour l'évaluation du modèle, la fonction affiche la MSE (mean-squared error) et l'indice R²

## 📄 Auteurs

Projet réalisé par Thomas ROULEAU, Florelle RAULIN, Pierre ZBORIL-Berteaud

