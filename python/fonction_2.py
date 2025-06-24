import pandas as pd
import numpy as np
import pickle,warnings
from sklearn.model_selection import train_test_split,cross_val_score,GridSearchCV
from sklearn.preprocessing import LabelEncoder,StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score,confusion_matrix,ConfusionMatrixDisplay
from sklearn.linear_model import LogisticRegression
import matplotlib.pyplot as plt
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC


#PREPARATION DES DONNEES
#nettoyer les données
def nettoyage_donnees_AIS(emplacement_file):
    #récuperation des donnees
    data = pd.read_csv(emplacement_file)
    #On garde seulement les données importantes
    data = data[['Length','Width','Draft', 'VesselType']]
    
    #encoder variable cible VesselType
    label_encoder = LabelEncoder()
    data['VesselType'] = label_encoder.fit_transform(data['VesselType'])


    with open('../model/label_encoder.pkl', 'wb') as f:
        pickle.dump(label_encoder, f)

    return data



#normaliser les données 
def normaliser_donnees(data):
    features_numeriques = ['Length','Width','Draft']
    scaler = StandardScaler()
    data_scaled = scaler.fit_transform(data[features_numeriques])


    #convertir en DataFrame
    data_scaled_df = pd.DataFrame(data_scaled, columns=features_numeriques)
    data_scaled_df['VesselType'] = data['VesselType']

    with open('../model/scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)


    return data_scaled_df


#préparer les données
def prepare_donnees(data_scaled_df):
    #jeu d'entrainement

    X= data_scaled_df[['Length','Width','Draft']]
    y = data_scaled_df['VesselType']

    #sépare les données de test et d'entrainement
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    return X_train, X_test, y_train, y_test





#APPRENTISSAGE SUPERVISE POUR LA CLASSIFICATION
#méthode Random Forest
def classification_random_forest(X_train, X_test, y_train, y_test):
    X_train.info()

    #entrainement du modèle
    rf = RandomForestClassifier(n_estimators=100, random_state=42,max_depth=7)
    rf.fit(X_train, y_train)

    #prédiction
    y_pred = rf.predict(X_test)

    #évaluation
    print("Accuracy pour la méthode du Random Forest :", accuracy_score(y_test, y_pred))
    print("Classification report pour la méthode du Random Forest :", classification_report(y_test, y_pred,zero_division=0))

    with open('../model/modele_rf.pkl', 'wb') as f:
        pickle.dump(rf, f)

    return rf, y_test, y_pred



#méthode de Logistic Regression
def classification_Logistic_Regression (X_train, X_test, y_train, y_test) :
    #création du modèle
    log_reg = LogisticRegression(C=0.1,penalty='l2',solver='saga')
    log_reg.fit(X_train, y_train)

    # Prédictions
    y_pred = log_reg.predict(X_test)

    #évaluation
    print("Accuracy pour la méthode de la Régression Logistique :", accuracy_score(y_test, y_pred))
    print("Classification report pour la méthode de la Régression Logistique :", classification_report(y_test, y_pred,zero_division=0))

    with open('../model/modele_logreg.pkl', 'wb') as f:
        pickle.dump(log_reg, f)

    return log_reg, y_test, y_pred


    
#méthode SVM
def classification_SVM(X_train, X_test, y_train, y_test):
    # Création du modèle SVM (avec kernel RBF par défaut)
    svm_model = SVC(C=1.0, kernel='rbf', gamma='scale')

    # Entraînement du modèle
    svm_model.fit(X_train, y_train)

    # Prédictions
    y_pred = svm_model.predict(X_test)

    # Évaluation
    print("Accuracy pour la méthode SVM :", accuracy_score(y_test, y_pred))
    print("Classification report pour la méthode SVM :", classification_report(y_test, y_pred, zero_division=0))

    # Sauvegarde du modèle
    with open('../model/modele_svm.pkl', 'wb') as f:
        pickle.dump(svm_model, f)

    return y_test, y_pred




#METRIQUES POUR LA CLASSIFICATION
def matrice_confusion (y_test, y_pred,type_matrice):
    cm = confusion_matrix(y_test, y_pred)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm)
    disp.plot(cmap='Blues')
    plt.title(f"Matrice de confusion - {type_matrice}")
    plt.tight_layout()
    plt.show()


#GridSearchcv
#RandomForest
def grid_search_model (X_train, y_train,model,nom) :
    best_estimator =0
    best_params=0
    if nom=="RandomForest":
        #dictionnaire de paramètres qui nous permet de tester plusieurs combinaisons possibles
        param_grid_rf = {
        'n_estimators': [50, 100],
        'max_depth' : [None, 10],
        'min_samples_split' : [2, 5],
        'min_samples_leaf' : [1],
        'bootstrap' : [True],
        'max_features' : ['sqrt']
        }

        grid_search_rf = GridSearchCV(estimator=model, param_grid=param_grid_rf, cv=3, n_jobs=-1, scoring='accuracy', verbose=1)
        grid_search_rf.fit(X_train,y_train)

        print("\n Le meilleur estimateur pour le Random Forest est :")
        print(grid_search_rf.best_estimator_)
        print("\n Les meilleurs hyperparamètres pour le Random Forest sont :")
        print(grid_search_rf.best_params_)
        print(f"\n Le score pour le Random Forest est : {grid_search_rf.best_score_}")

        best_estimator = grid_search_rf.best_estimator_
        best_params = grid_search_rf.best_params_
    if(nom=="LogisticRegression") :
        #Régression Logistique
        param_grid_lr ={
                'C': [0.1, 1],
                'penalty': ['l2'],
                'solver': ['lbfgs'],
                'max_iter': [500]
            }

        grid_search_lr = GridSearchCV(estimator=model, param_grid=param_grid_lr, cv=3, n_jobs=-1, scoring='accuracy', verbose=1)
        grid_search_lr.fit(X_train,y_train)

        print("\n Le meilleur estimateur pour la Régression Logistique est :")
        print(grid_search_lr.best_estimator_)
        print("\n Les meilleurs hyperparamètres pour la Régression Logistique sont :")
        print(grid_search_lr.best_params_)
        print(f"\n Le score pour la Régression Logistique est : {grid_search_lr.best_score_}")

        best_estimator = grid_search_lr.best_estimator_
        best_params = grid_search_lr.best_params_

    if nom == "SVM":
        # SVM : grille des hyperparamètres
        param_grid_svm = {
            'C': [0.1, 1, 10],
            'kernel': ['linear', 'rbf'],
            'gamma': ['scale', 'auto']
        }

        grid_search_svm = GridSearchCV(estimator=model, param_grid=param_grid_svm, 
                                        cv=3, n_jobs=-1, scoring='accuracy', verbose=1)
        grid_search_svm.fit(X_train, y_train)

        print("\n Le meilleur estimateur pour le SVM est :")
        print(grid_search_svm.best_estimator_)
        print("\n Les meilleurs hyperparamètres pour le SVM sont :")
        print(grid_search_svm.best_params_)
        print(f"\n Le score pour le SVM est : {grid_search_svm.best_score_}")

        best_estimator = grid_search_svm.best_estimator_
        best_params = grid_search_svm.best_params_
    elif nom == "SVM":
        param_grid_svm = {
            'C': [1],
            'kernel': ['rbf'],
            'gamma': ['scale']
        }
        grid_search = GridSearchCV(model, param_grid_svm, cv=2, n_jobs=-1, scoring='accuracy', verbose=0)
        grid_search.fit(X_train, y_train)

        print("\n Le meilleur estimateur pour le SVM est :")
        print(grid_search.best_estimator_)
        print("\n Les meilleurs hyperparamètres pour le SVM sont :")
        print(grid_search.best_params_)
        print(f"\n Le score pour le SVM est : {grid_search.best_score_}")

    elif nom == "KNN":
        param_grid_knn = {
            'n_neighbors': [3, 5],
            'weights': ['uniform'],
            'p': [2]  # Euclidean
        }
        grid_search = GridSearchCV(model, param_grid_knn, cv=2, n_jobs=-1, scoring='accuracy', verbose=0)
        grid_search.fit(X_train, y_train)

        print("\n Le meilleur estimateur pour le KNN est :")
        print(grid_search.best_estimator_)
        print("\n Les meilleurs hyperparamètres pour le KNN sont :")
        print(grid_search.best_params_)
        print(f"\n Le score pour le KNN est : {grid_search.best_score_}")


    return best_estimator, best_params


def classification_KNN(X_train, X_test, y_train, y_test):

    knn_model = KNeighborsClassifier(n_neighbors=3,p=2,weights='uniform')


    knn_model.fit(X_train, y_train)


    y_pred = knn_model.predict(X_test)


    print("Accuracy pour la méthode KNN :", accuracy_score(y_test, y_pred))
    print("Classification report pour la méthode KNN :", classification_report(y_test, y_pred, zero_division=0))

    # Sauvegarde du modèle
    with open('../model/modele_knn.pkl', 'wb') as f:
        pickle.dump(knn_model, f)

    return y_test, y_pred



def prediction_vessel_type(model,new_data,label_encoder=None):
    y_pred = model.predict(new_data)
    if label_encoder:
        y_pred= label_encoder.inverse_transform([y_pred])
    print("y_pred : ",y_pred[0])
    return y_pred[0]




def validation_croisee(model,X, y, cv):
    rf_scores = cross_val_score(model, X, y, cv=cv, scoring='accuracy')
    print("Le score pour la validation croisée pour le modèle choisis est :", rf_scores)
    print("Le score moyen pour la validation croisée pour le modèle choisis est :", np.mean(rf_scores))

    """lr_scores = cross_val_score(lr, X, y, cv, scoring='accuracy')
    print("Le score pour la validation croisée de Régression Logistique est :", lr_scores)
    print("Le score moyen pour la validation croisée de Régression Logistique est :", np.mean(lr_scores))"""







