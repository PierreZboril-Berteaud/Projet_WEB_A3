from fonction_1 import *

if __name__ == '__main__':
    k=3


    warnings.filterwarnings("ignore", category=UserWarning)
    parser = argparse.ArgumentParser(description="Mon programme avec options")
    parser.add_argument("--LAT", type=float, nargs="?", help="Lattitude du navire", required=False)
    parser.add_argument("--LON", type=float, nargs="?", help="Longitude du navire", required=False)
    parser.add_argument("--SOG", type=float, nargs="?", help="Vitesse du navire", required=False)
    parser.add_argument("--COG", type=float, nargs="?", help="Cap du navire", required=False)
    parser.add_argument("--Heading", type=float, nargs="?", help="Direction du navire", required=False)
    parser.add_argument("--Train", type=bool, nargs="?", help="Mode Entrainement", required=False)
    parser.add_argument("--Model", type=str, nargs="?", help="Choix du modèle", required=False)
    parser.add_argument("--Score", type=bool, nargs="?", help="Affiche le score", required=False)
    parser.add_argument("--Maps", type=bool, nargs="?", help="Affichage des cartes", required=False)
    parser.add_argument("--Predict", type=bool, nargs="?", help="Mode prédiction", required=False)

    args = parser.parse_args()


    if args.Train:
        if args.Model=="Kmeans":
            data = nettoyage_donnees_AIS('../export_IA.csv')
            data,X_scaled = Kmeans_train(data,k)
    else:
        with open('../model/kmeans.pkl', 'rb') as f:
            kmeans = pickle.load(f)
    if args.Score:
        Kmeans_score(kmeans,data,k)
    if args.Maps:
        data['Cluster'] = kmeans.labels_
        X_scaled = scale_for_map(data)
        Kmeans_plot(data, X_scaled, k)
        Kmeans_map(data, k)
    if args.Predict and args.Model=="Kmeans":
        new_data = {}
        new_data['LON'] = args.LON
        new_data['LAT'] = args.LAT
        new_data['SOG'] = args.SOG
        new_data['COG'] = args.COG
        new_data['Heading'] = args.Heading

        new_data_df = pd.DataFrame([new_data])

        with open('../model/scaler_kmeans.pkl', 'rb') as f:
            scaler = pickle.load(f)

        new_data_scaled = scaler.transform(new_data_df)

        y_pred = predict_kmeans(new_data_scaled, kmeans)
        print(y_pred[0])

