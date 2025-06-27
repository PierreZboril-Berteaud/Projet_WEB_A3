# 🌐 Projet Web – Analyse et Prédiction de Comportement de Navires

Bienvenue sur notre application web dédiée à l’analyse des trajectoires maritimes à partir des données AIS. Ce site permet de visualiser, gérer et analyser des navires dans une base de données interactive, tout en exploitant des modèles d’intelligence artificielle pour la prédiction de leur comportement.

---

## 🏠 Page d'accueil

La page d’accueil présente le contexte et les objectifs du projet :

- **Contexte** : Le Golfe du Mexique est une zone maritime stratégique pour le transport international. L’analyse des trajectoires des navires dans cette région permet de mieux comprendre leurs comportements.
- **Objectif** : Offrir un outil visuel et interactif permettant de :
  - Suivre les navires enregistrés.
  - Visualiser leur trajectoire sur une carte.
  - Prédire leur cluster d’appartenance, leur type et leur position future.

---

## ➕ Page Ajout Navire

Cette page permet de **gérer dynamiquement les navires** dans la base de données :

- **Ajout de navire** via un formulaire simple (coordonnées, vitesse, cap, etc.).
- **Suppression de navire** existant à partir de son identifiant (MMSI).

---

## 📊 Page Affichage

Cette page est dédiée à la **visualisation et à l’analyse avancée** :

- **Affichage des navires** sous forme de tableau interactif avec :
  - **Filtres dynamiques** (type, MMSI, vitesse, etc.).
  - **Tri et recherche** personnalisés.
- **Carte interactive** affichant la position des navires.
- **Prédiction automatique** sur un navire sélectionné :
  - 📌 **Cluster d’appartenance** (groupement comportemental).
  - 🛳️ **Type de navire** (cargo, plaisance, tanker…).
  - 🧭 **Position future** estimée après un intervalle de temps défini.

Ces prédictions sont réalisées à l’aide de modèles de machine learning (ex : KMeans) préentraînés et intégrés dans l’application.

---

## 🧠 Backend et Scripts

L'application repose sur un ensemble de scripts Python appelés automatiquement pour :

- Prédire les clusters(`main_fonc_1.py`)
- Prédire les types de navires (`main_fonc_2`)
- Prédire les trajectoires(`main_fonc_3`)

Ces scripts interagissent avec une base de données centralisée et sont appelés par l’interface web via des requêtes asynchrones (AJAX/API).

---

## 📁 Technologies utilisées

- **Frontend** : HTML, CSS, JavaScript (jQuery, Leaflet)
- **Backend** : PHP,Python
- **Machine Learning** : scikit-learn (modèles de clustering, prédiction)
- **Base de données** : PostgreSQL
- **Architecture** : AJAX

---

## 🚀 Lancer le projet

1. Démarrer apache2 ainsi que postgresSQL.
2. Créer une base de donnée et y insérer les tables du fichier database.sql
3. dans les fichiers constants.php/script_insert_bdd.py entrer les informations de connexion à la base de donnée
3. Ouvrir `index.html` dans le navigateur.
4. Naviguer entre les différentes pages pour gérer et analyser les navires.

---
## ⚠️ Attention 
1. Les fonctions de prédiction peuvent mettre beaucoup de temps à s'executer, car les prédictions sont faites une par une (surtout dans le cas du clustering)
2. Les fonctions prédiction de type ainsi que prédiction de trajectoire mettent en moyenne 5 à 10 secondes à s'éxecuter
3. Le temps d'éxecution de la fonction prédiction de cluster peut être très long selon le nombre de données mise en entrée
## 👥 Auteurs

Projet réalisé par :

- Thomas **ROULEAU**
- Florelle **RAULIN**
- Pierre **ZBORIL-Berteaud**
