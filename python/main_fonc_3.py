from fonction_3 import *

if __name__ == '__main__':

    """
    Ajout d'arguments pour pouvoir entrer des données à la main
    """
    parser = argparse.ArgumentParser(description="Mon programme avec options")
    parser.add_argument("--LAT", type=float, nargs="?", help="Lattitude du navire", required=False)
    parser.add_argument("--LON", type=float, nargs="?", help="Longitude du navire", required=False)
    parser.add_argument("--SOG", type=float, nargs="?", help="Vitesse du navire", required=False)
    parser.add_argument("--COG", type=float, nargs="?", help="Cap du navire", required=False)
    parser.add_argument("--Heading", type=float, nargs="?", help="Direction du navire", required=False)
    parser.add_argument("--VesselType", type=int, nargs="?", help="Type du navire", required=False)
    parser.add_argument("--Length", type=float, nargs="?", help="Longueur du navire", required=False)
    parser.add_argument("--Width", type=float, nargs="?", help="Largeur du navire", required=False)
    parser.add_argument("--Draft", type=float, nargs="?", help="Tirant d'eau du navire", required=False)
    parser.add_argument("--Cargo", type=float, nargs="?", help="Type de cargaison du navire", required=False)
    parser.add_argument("--time", type=float, nargs="?", help="Delta temps voulu pour la prédiction", required=False)
    parser.add_argument("--VesselName", type=str, nargs="?", help="Nom du navire", required=False)
    parser.add_argument("--Train", type=bool, nargs="?", help="Entrainement du modèle", required=False)
    args = parser.parse_args()

    """Les arguments sont mis dans un data frame"""
    if not args.Train:
        with open('modele.pkl', 'rb') as f:
            model = pickle.load(f)
    else:
        if args.Train==True:
            print("Entrainement")
            data = pd.read_csv('export_IA.csv')
            model,pred_d= train_trajectory_model(data)

    if args.VesselName:
        data = pd.read_csv('export_IA.csv')
        print("true")
        pred_df = prediction_vessel(data,model,args.VesselName)
        print('pred_df',pred_df)
        afficher_difference_pred_true(pred_df)
    else:
        if args.LAT and args.LON and args.SOG and args.COG and args.Heading and args.VesselType and args.Length and args.Width and args.Draft and args.Cargo and args.time:
            new_data = {}
            new_data['LAT'] = args.LAT
            new_data['LON'] = args.LON
            new_data['SOG'] = args.SOG
            new_data['COG'] = args.COG
            new_data['Heading'] = args.Heading
            new_data['VesselType'] = args.VesselType
            new_data['Length'] = args.Length
            new_data['Width'] = args.Width
            new_data['Draft'] = args.Draft
            new_data['Cargo'] = args.Cargo
            new_data['delta'] = args.time
            new_data_df = pd.DataFrame([new_data])

            predicted_delta = model.predict(new_data_df)

            predicted_delta_lat = predicted_delta[0, 0]
            predicted_delta_lon = predicted_delta[0, 1]
            #print("\nPredicted next position:")
            print(predicted_delta_lat)
            print(predicted_delta_lon)
        else:
            print("Si vous voulez faire une prédiction, vous devez entrer les valeurs requises")