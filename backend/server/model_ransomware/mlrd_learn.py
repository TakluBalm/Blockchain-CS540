import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import joblib
import pickle
from sklearn import model_selection
import sklearn.ensemble as ske
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import BaggingClassifier
from sklearn.neural_network import MLPClassifier
import yara
from sklearn.metrics import f1_score
from sklearn.linear_model import LogisticRegression
import warnings
from sklearn.exceptions import ConvergenceWarning

def plot_comparison(results):
    classifiers = list(results.keys())
    cross_val_scores = [result['Cross Validation Score'] for result in results.values()]
    f1_scores = [result['F1 Score'] for result in results.values()]

    bar_width = 0.35  # Width of the bars

    # Convert classifiers to numerical values
    x_values = range(len(classifiers))

    # Plotting both Cross Validation Scores and F1 Scores in the same plot
    plt.figure(figsize=(12, 6))
    bar1 = plt.bar(x_values, cross_val_scores, width=bar_width, color='blue', alpha=0.7, label='Cross Validation Score')
    bar2 = plt.bar([x + bar_width for x in x_values], f1_scores, width=bar_width, color='green', alpha=0.7, label='F1 Score')

    plt.xlabel('Classifiers')
    plt.ylabel('Score')
    plt.title('Comparison of Cross Validation Scores and F1 Scores')
    plt.legend()

    # Set y-axis ticks with a precise scale of 0.1
    plt.yticks(np.arange(0, 1.1, 0.1))

    # Show the plot
    plt.show()

# Main code function that trains various classifiers on the dataset.
def main():
    warnings.filterwarnings("ignore", category=ConvergenceWarning)
    print('\n[+] Training MLRD using Multiple Classifiers...')

    # Creates pandas dataframe and reads in csv file.
    df = pd.read_csv('data_file.csv', sep=',')

    # Drops FileName, md5Hash, and Label from data.
    X = df.drop(['FileName', 'md5Hash', 'Benign'], axis=1).values
    rules = yara.compile(filepath='rules/Bitcoin/bitcoin.yara')

    # Assigns y to label
    y = df['Benign'].values

    # Splitting data into training and test data
    X_train, X_test, y_train, y_test = model_selection.train_test_split(X, y, test_size=0.2, random_state=42)

    classifiers = {
        'Random Forest': ske.RandomForestClassifier(n_estimators=50),
        'k-Nearest Neighbors': KNeighborsClassifier(),
        'Decision Tree': DecisionTreeClassifier(),
        'Bagging': BaggingClassifier(),
        # 'MLP Classifier': MLPClassifier(),
        'Logistic Regression': LogisticRegression(solver='lbfgs',max_iter=4000)
    }

    results = {}

    for name, clf in classifiers.items():
        print(f'\n[+] Training {name}...')
        clf.fit(X_train, y_train)

        # Perform cross-validation and print out accuracy.
        score = model_selection.cross_val_score(clf, X_test, y_test, cv=10)
        print(f'\n\t[*] {name} Cross Validation Score: {round(score.mean()*100, 2)} %')

        # Calculate f1 score.
        y_train_pred = model_selection.cross_val_predict(clf, X_train, y_train, cv=3)
        f1 = f1_score(y_train, y_train_pred)
        print(f'\t[*] {name} F1 Score: {round(f1*100, 2)} %')

        # Save the configuration of the classifier and features as a pickle file.
        all_features = X.shape[1]
        features = [df.columns[2+feature] for feature in range(all_features)]

        try:
            print(f"\n[+] Saving {name} algorithm and feature list in classifier directory...")
            joblib.dump(clf, f'classifier/{name.lower()}_classifier.pkl')
            open(f'classifier/{name.lower()}_features.pkl', 'wb').write(pickle.dumps(features))
            print("\n[*] Saved.")
        except:
            print(f'\n[-] Error: {name} algorithm and feature list not saved correctly.\n')

        # Store results for comparison
        results[name] = {
            'Cross Validation Score': score.mean(),
            'F1 Score': f1
        }

    # Compare all classifiers based on scores
    print("\n[+] Comparison of Classifiers:")
    for name, scores in results.items():
        print(f"\nClassifier: {name}")
        print(f"\tCross Validation Score: {round(scores['Cross Validation Score']*100, 2)} %")
        print(f"\tF1 Score: {round(scores['F1 Score']*100, 2)} %")
    
    plot_comparison(results)

if __name__ == '__main__':
    main()
    

