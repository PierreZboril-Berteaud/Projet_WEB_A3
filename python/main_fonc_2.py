from xmlrpc.client import boolean

from fonction_2 import *
import argparse
if __name__ == '__main__':
    data = nettoyage_donnees_AIS('../export_IA.csv')
    data_scaled_df = normaliser_donnees(data)
    X = data[['Length','Width','Draft', 'VesselType']]
    y = data['VesselType']
    X_train, X_test, y_train, y_test = prepare_donnees(data_scaled_df)
    prediction=0
    """
        Ajout d'arguments pour pouvoir entrer des données à la main
    """
    warnings.filterwarnings("ignore", category=UserWarning)
    parser = argparse.ArgumentParser(description="Mon programme avec options")
    parser.add_argument("--Train", type=bool, nargs="?", help="Entrainement du modèle", required=False)
    parser.add_argument("--Model", type=str, nargs="?", help="Choix du modèle", required=False)
    parser.add_argument("--ConfMat", type=bool, nargs="?", help="Matrice de confusion", required=False)
    parser.add_argument("--Length", type=float, nargs="?", help="Longueur du navire", required=False)
    parser.add_argument("--Width", type=float, nargs="?", help="Largeur du navire", required=False)
    parser.add_argument("--Draft", type=float, nargs="?", help="Tirant d'eau du navire", required=False)
    parser.add_argument("--Predict", type=bool, nargs="?", help="Prediction", required=False)
    parser.add_argument("--GridSearch", type=bool, nargs="?", help="GridSearch", required=False)
    parser.add_argument("--Cross_val_score", type=bool, nargs="?", help="Validation croisée", required=False)


    args = parser.parse_args()

    if not args.Train and args.Model=="RandomForest":
        with open('../model/modele_rf.pkl', 'rb') as f:
            model = pickle.load(f)
    if not args.Train and args.Model=="LogisticRegression":
        with open('../model/modele_logreg.pkl', 'rb') as f:
            model = pickle.load(f)
    if not args.Train and args.Model=="SVM":
        with open('../model/modele_svm.pkl', 'rb') as f:
            model = pickle.load(f)
    if not args.Train and args.Model == "KNN":
        with open('../model/modele_knn.pkl', 'rb') as f:
            model = pickle.load(f)


    if not args.Train and args.Predict==True:
        with open('../model/scaler.pkl', 'rb') as f:
            scaler = pickle.load(f)
        with open('../model/label_encoder.pkl', 'rb') as f:
            label_encoder = pickle.load(f)


    if args.GridSearch and args.Model:
        best_estimator,best_param = grid_search_model(X_train, y_train, model,args.Model)
    if args.Train:
        if args.Model == "RandomForest":
            model_random, y_random_test, y_random_pred = classification_random_forest(X_train, X_test, y_train, y_test)
            if args.ConfMat:
                matrice_confusion(y_random_test, y_random_pred, "Random Forest")
        if args.Model == "LogisticRegression":
            model_regression, y_regression_test, y_regression_pred = classification_Logistic_Regression(X_train, X_test, y_train, y_test)
            if args.ConfMat:
                matrice_confusion(y_regression_test, y_regression_pred, "Régression Linéaire")
        if args.Model == "SVM":
            y_svm_test,y_svm_pred_test = classification_SVM(X_train, X_test, y_train, y_test)
            if args.ConfMat:
                matrice_confusion(y_svm_test, y_svm_pred_test, "SVM")
        if args.Model == "KNN":
            y_knn_test,y_knn_pred_test = classification_KNN(X_train, X_test, y_train, y_test)
        if args.Model != "LogisticRegression" and args.Model != "RandomForest" and args.Model!="SVM" and args.Model!="KNN":
            print("Veuillez choisir entre 'RandomForest' ou 'LogisticRegression'")

    if args.Predict and not args.Train:
        new_data = {}
        new_data['Length'] = args.Length
        new_data['Width'] = args.Width
        new_data['Draft'] = args.Draft
        new_data_df = pd.DataFrame([new_data])

        if args.Model == "RandomForest":
            prediction = prediction_vessel_type(model,new_data_df,label_encoder)

        if args.Model == "LogisticRegression":
            prediction = prediction_vessel_type(model, new_data_df,label_encoder)
        if args.Model== "SVM":
            prediction = prediction_vessel_type(model,new_data_df,label_encoder)
        if args.Model == "KNN":
            prediction = prediction_vessel_type(model, new_data_df,label_encoder)
    if args.Cross_val_score:
        cross_score = validation_croisee(model, X, y, 3)



