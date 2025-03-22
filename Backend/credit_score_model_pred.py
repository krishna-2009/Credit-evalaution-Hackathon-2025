##  This script is under development and is not yet complete.

import csv
import pandas as pd
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

# Load GIS dataset
csv_file = 'gis_dummy_data.csv'
data = pd.read_csv(csv_file)

# Convert month and soil_type to numerical values for training
month_mapping = {month: i+1 for i, month in enumerate(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])}
soil_mapping = {'Loam': 2, 'Clay': 1, 'Sandy': 0}

data['month'] = data['month'].map(month_mapping)
data['soil_type'] = data['soil_type'].map(soil_mapping)

# Define features and target
X = data[['district', 'crop_type', 'month', 'rainfall_mm', 'soil_type', 'yield_kg_per_hectare']]
y = data['credit_score']

# Convert categorical columns to numerical with one-hot encoding
X = pd.get_dummies(X)

# Split data for training and testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Decision Tree model
model = DecisionTreeRegressor(max_depth=10)
model.fit(X_train, y_train)

# Evaluate model
predictions = model.predict(X_test)
print("Model MAE:", mean_absolute_error(y_test, predictions))

# Function to predict new credit score
def calculate_new_credit_score(current_score, district, crop_type, month):
    farmer_data = {'district': district, 'crop_type': crop_type, 'month': month_mapping[month],
                   'rainfall_mm': 800, 'soil_type': soil_mapping.get('Loam', 1), 'yield_kg_per_hectare': 2000}
    
    farmer_input = pd.DataFrame([farmer_data])
    farmer_input = pd.get_dummies(farmer_input)
    farmer_input = farmer_input.reindex(columns=X.columns, fill_value=0)

    predicted_score = model.predict(farmer_input)[0]
    return round((current_score * 0.3) + (predicted_score * 0.7), 2)


# Generate loan recommendation
def recommend_loan(new_score, crop_type):
    if new_score >= 800:
        return f"Premium loan available! Expand {crop_type} farming or modernize equipment."
    elif new_score >= 650:
        return f"Standard crop loan recommended. Boost yield for {crop_type} and improve infrastructure."
    elif new_score >= 500:
        return f"Basic loan suggested. Focus on stabilizing {crop_type} output and building credit."
    else:
        return f"Emergency loan suggested. Prioritize essential inputs for {crop_type} survival."


# Test the system
farmer_credit_score = 600
farmer_district = "Ahmedabad"
farmer_crop = "Wheat"
farmer_month = "May"

new_credit_score = calculate_new_credit_score(farmer_credit_score, farmer_district, farmer_crop, farmer_month)
print(f"Farmer's new credit score: {new_credit_score}")

# Generate loan recommendation
recommendation = recommend_loan(new_credit_score, farmer_crop)
print(recommendation)
