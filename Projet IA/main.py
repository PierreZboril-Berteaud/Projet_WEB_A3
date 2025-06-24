from fonction_1 import *
#from fonction_3 import *

if __name__ == '__main__':

    data = nettoyage_donnees_AIS('./export_IA.csv')

    
    with open('kmeans.pkl', 'rb') as f:
            kmeans = pickle.load(f)

#    data_one_vessel = nettoyage_donnees_AIS('./data_one_vessel.csv')

 #   model= train_trajectory_model(data)


  #  y_pred = test_with_data(data_one_vessel,model)
    Kmeans_train(data,3)
    #dbscan(data)