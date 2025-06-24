# Projet IA 

Dans ce projet, vous avez la possibilité d'utiliser plusieurs fonctionnalitées :

* `entrainement` : Entraine un modèle à partir d'un tableur avec les données de l'AIS.
* `prediction` : Effectue une prédiction du type de navire en fonction des données entrées.

## 📁 Fichiers requis

* `fonc_2.py` : script contenant les différentes fonctions.
* `main_fonc_2.py` : script contenant le script.
* `model_rf.pkl` : fichier contenant le modèle RandomForest déjà entrainé (permet d'éviter un temps d'execution trop long).
* `model_logreg.pkl` : fichier contenant le modèle LogisticRegression déjà entrainé (permet d'éviter un temps d'execution trop long).
* `scaler.pkl` : fichier contenant les données numériques normalisées.
* `label_encoder.pkl` : fichier contenant les données catégorielles encodées
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
python main_fonc_2.py [options]
```

#### Options disponibles

| Option     | Valeurs possibles        | Description                                          | Obligatoire pour prediction 
| ---------- | ------------------------ | -------------------------------------------------    | ------------------------------------------------
|`--Length` | valeurs supérieurs à `10`| Longueur du navire                                    | 	✅ Oui
|`Width` | valeurs supérieurs à `3`| Largeur du navire                                         | 	✅ Oui
|`Draft`| valeurs supérieurs à `0.5`| Profondeur du navire                                     | 	✅ Oui
|`Model`| "RandomForest", "LogisticRegression" ou "SVM"| Choix du modèle pour la prédiction/entrainement | ✅ Oui
|`Predict` | booléen | Permet de choisir si on veut faire une prédiction |  ✅ Oui
|`ConfMat`| booléen |Affiche la matrice de confusion après entrainement                        |  ❌Non 
|`Train`| booléen | Entraine un nouveau modèle                                                 |  ❌Non  (⚠️Entraine un nouveau modèle si valeurs "True")
|`GridSearch`| booléen | Execute l'algorithme gridSearch pour trouver les meilleurs paramètres d'executions | ❌Non 

#### Exemples

```bash
# Execution pour prédiction d'un type de navire
python main_fonc_2.py --Predict True --Model RandomForest --Length 183 --Width 28.0 --Draft 10.0 

# Exécution pour l'entrainement du modèle
python main_fonc_2.py --Train True --Model LogisticRegression #⚠️l'entrainement d'un modèle peut prendre du temps

#Affichage de la matrice de confusion ou du GridSearch
python main_fonc_2.py --Train True --Model RandomForest --ConfMat True
python main_fonc_2.py --Train True --Model LogisticRegression --GridSearch True 
```
```
Commandes/
|── GridSearch & Model
    |── Effectue un gridSearch des meilleurs paramètres pour un modèle
├── Train/                      
│   ├── RandomForest/
|   |     |-Entraine un modèle avec RandomForest
|   |     |──ConfMat/
|   |         |── Affiche la matrice de confusion     
|   |         
│   ├── LogisticRegression/
|   |    |- Entraine un modèle avec une regression logistique     
|   |       |──ConfMat/
|   |         |── Affiche la matrice de confusion       
│                 
│
├── Predict/         
│   |── RandomForest+ "Arguments"/
|   |    |──Prédit des données avec le modèle randomForest
|   |
|   |── LogisticRegression + "Arguments"/
|   |   |──Prédit des données avec le modèle LogisticRegression          
```
## 📄 Auteurs

Projet réalisé par Thomas ROULEAU, Florelle RAULIN, Pierre ZBORIL-Berteaud
