import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt
from sklearn.model_selection import GridSearchCV
import warnings

#PREPARATION DES DONNEES



#APPRENTISSAGE SUPERVISE POUR LA CLASSIFICATION
#méthode Random Forest
def classification_random_forest(X_train, X_test, y_train, y_test):
  
    #entrainement du modèle
    rf = RandomForestClassifier(n_estimators=100, random_state=42,max_depth=7)
    rf.fit(X_train, y_train)

    #prédiction
    y_pred = rf.predict(X_test)

    #évaluation
    print("Accuracy pour la méthode du Random Forest :", accuracy_score(y_test, y_pred))
    print("Classification report pour la méthode du Random Forest :", classification_report(y_test, y_pred,zero_division=0))

    with open('modele_rf.pkl', 'wb') as f:
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

    with open('modele_logreg.pkl', 'wb') as f:
        pickle.dump(log_reg, f)

    return log_reg, y_test, y_pred


    
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



#Régression Logistique    
    if(nom=="LogisticRegression") :
        param_grid_lr ={
                'C': [0.1, 1],
                'penalty': ['l2'],
                'solver': ['lbfgs'],
                'max_iter': [500]
            }

        grid_search_lr = GridSearchCV(estimator=model, param_grid=param_grid_lr, cv=3, n_jobs=-1, scoring='accuracy', verbose=1)
        grid_search_lr.fit(X_train,y_train)

       

    print(f"\nLe meilleur estimateur pour ({nom}): {grid_search_lr.best_estimator_}")
    print(f"\n Les meilleurs hyperparamètres pour ({nom}): {grid_search_lr.best_params_}")
    print(f"\n Le score moyen (validation croisée) : {grid_search_lr.best_score_}")

    best_estimator = grid_search_lr.best_estimator_
    best_params = grid_search_lr.best_params_

    return best_estimator, best_params


def prediction_vessel_type(model,label_encoder,new_data):
    y_pred = model.predict(new_data)
    y_pred= label_encoder.inverse_transform([y_pred])
    print("y_pred : ",y_pred[0])
    return y_pred[0]












