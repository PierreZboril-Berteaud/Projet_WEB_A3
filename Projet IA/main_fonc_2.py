from fonction_2 import *
import argparse
if __name__ == '__main__':
    """
        Ajout d'arguments pour pouvoir entrer des données à la main
        """
    parser = argparse.ArgumentParser(description="Mon programme avec options")
    parser.add_argument("--LAT", type=float, nargs="?", help="Lattitude du navire", required=False)
    parser.add_argument("--LON", type=float, nargs="?", help="Longitude du navire", required=False)
    parser.add_argument("--SOG", type=float, nargs="?", help="Vitesse du navire", required=False)
    parser.add_argument("--COG", type=float, nargs="?", help="Cap du navire", required=False)
    parser.add_argument("--Heading", type=int, nargs="?", help="Direction du navire", required=False)
    parser.add_argument("--VesselType", type=int, nargs="?", help="Type du navire", required=False)
    parser.add_argument("--Length", type=int, nargs="?", help="Longueur du navire", required=False)
    parser.add_argument("--Width", type=float, nargs="?", help="Largeur du navire", required=False)
    parser.add_argument("--Draft", type=float, nargs="?", help="Tirant d'eau du navire", required=False)
    parser.add_argument("--Cargo", type=float, nargs="?", help="Type de cargaison du navire", required=False)
    parser.add_argument("--time", type=float, nargs="?", help="Delta temps voulu pour la prédiction", required=False)
    parser.add_argument("--VesselName", type=str, nargs="?", help="Nom du navire", required=False)
    parser.add_argument("--Train", type=str, nargs="?", help="Entrainement du modèle", required=False)
    args = parser.parse_args()

    data= nettoyage_donnees_AIS('./export_IA.csv')
    data_scaled_df = normaliser_donnees(data)

    X_train, X_test, y_train, y_test = prepare_donnees(data_scaled_df)
    
    model_random, y_random_test, y_random_pred = classification_random_forest(X_train, X_test, y_train, y_test)
    model_regression, y_regression_test, y_regression_pred = classification_Logistic_Regression(X_train, X_test, y_train, y_test)
    
   
    matrice_confusion(y_random_test, y_random_pred, "Random Forest")
    matrice_confusion(y_regression_test, y_regression_pred, "Régression Linéaire")


    best_rf, best_lr = grid_search_model(X_train, y_train)


