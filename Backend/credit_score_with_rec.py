import csv

def calculate_new_credit_score(current_score, district, crop_type, month):
    # Read the GIS dataset
    with open('gis_data.csv', 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        district_data = [row for row in reader if row['district'] == district and row['crop_type'] == crop_type]
    
    if not district_data:
        print("No matching data found for this district and crop type.")
        return current_score

    # Calculate district average yield
    total_yield = sum(int(row['yield_kg_per_hectare']) for row in district_data)
    avg_yield = total_yield / len(district_data)

    # Calculate rainfall factor (normalized to 1000mm)
    avg_rainfall = sum(int(row['rainfall_mm']) for row in district_data) / len(district_data)
    rainfall_factor = min(1.2, max(0.8, avg_rainfall / 1000))

    # Soil type bonus (higher for loam, lower for sandy)
    soil_types = [row['soil_type'] for row in district_data]
    soil_bonus = 1.2 if 'Loam' in soil_types else (0.9 if 'Sandy' in soil_types else 1.0)

    # Crop type profitability factor (higher for high-demand crops like sugarcane)
    crop_profitability = {"Cotton": 1.1, "Wheat": 1.0, "Groundnut": 1.05, "Bajra": 0.9, "Sugarcane": 1.3}
    crop_factor = crop_profitability.get(crop_type, 1.0)

    # Seasonality factor (boost during peak months for specific crops)
    season_peak = {"Wheat": [11, 12, 1], "Cotton": [6, 7, 8], "Groundnut": [7, 8, 9], "Bajra": [6, 7, 8], "Sugarcane": [3, 4, 5]}
    season_factor = 1.1 if month in season_peak.get(crop_type, []) else 0.9

    # Final credit score formula with weighted factors
    new_score = current_score * (0.4 + 0.2 * (avg_yield / 2000) + 0.15 * rainfall_factor + 0.1 * soil_bonus + 0.1 * crop_factor + 0.05 * season_factor)
    return round(new_score, 2)


def recommend_loan(new_score, crop_type):
    """
    Generate a recommendation based on credit score and crop type.
    """
    if new_score >= 800:
        return f"✅ Congratulations! You qualify for premium low-interest loans. Consider an expansion loan to grow more {crop_type} or invest in modern equipment."
    elif new_score >= 650:
        return f"🔧 You qualify for standard crop loans. Focus on maximizing yield for {crop_type}, and upgrading your irrigation systems could improve productivity."
    elif new_score >= 500:
        return f"⚡ You qualify for basic loans. Consider a crop loan to stabilize your {crop_type} output and improve your credit score over time."
    else:
        return f"🚨 Emergency loan suggested. Your credit score is low — focus on essential inputs for {crop_type} to ensure minimum yield this season."




# # Test the function with a farmer's input
# farmer_credit_score = 600
# farmer_district = "Ahmedabad"
# farmer_crop = "Wheat"
# farmer_month = 5  # May

# new_credit_score = calculate_new_credit_score(farmer_credit_score, farmer_district, farmer_crop, farmer_month)
# print(f"Farmer's new credit score: {new_credit_score}")

# # Generate loan recommendation
# recommendation = recommend_loan(new_credit_score, farmer_crop)
# print(recommendation)
