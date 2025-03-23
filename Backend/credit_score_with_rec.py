import csv

def calculate_new_credit_score(farmer_data):
    """
    Calculate a credit score based on comprehensive farm data.
    This version amplifies the impact of changes so that small variations
    can drive the score closer to 300 or 850.
    
    Parameters:
    - farmer_data: A dictionary containing all form fields from the credit score form
    
    Returns:
    - A tuple containing (credit_score, factor_percentages)
    """
    # ------------------ Base Score ------------------
    try:
        base_score = float(farmer_data.get('current_score', 500))
    except (ValueError, TypeError):
        base_score = 500

    # ------------------ Farmer Experience ------------------
    try:
        farm_age = int(float(farmer_data.get('farmAge', 0)))
    except (ValueError, TypeError):
        farm_age = 0

    if farm_age > 20:
        experience_factor = 1.3  # Veteran farmer
    elif farm_age > 10:
        experience_factor = 1.2  # Experienced farmer
    elif farm_age > 5:
        experience_factor = 1.1  # Established farmer
    elif farm_age > 2:
        experience_factor = 1.0  # Novice farmer
    else:
        experience_factor = 0.9  # New farmer

    # ------------------ Farm Characteristics ------------------
    try:
        farm_size = float(farmer_data.get('farmSize', 1))
    except (ValueError, TypeError):
        farm_size = 1

    if farm_size > 50:
        size_factor = 1.15  # Large farm
    elif farm_size > 20:
        size_factor = 1.1   # Medium-large farm
    elif farm_size > 10:
        size_factor = 1.05  # Medium farm
    elif farm_size > 5:
        size_factor = 1.0   # Small-medium farm
    else:
        size_factor = 0.95  # Small farm

    ownership_status = str(farmer_data.get('ownershipStatus', 'leased')).lower()
    if ownership_status == 'owned':
        ownership_factor = 1.2
    elif ownership_status == 'partial':
        ownership_factor = 1.1
    else:  # leased or other
        ownership_factor = 0.9

    # ------------------ Soil and Water Factors ------------------
    soil_type = str(farmer_data.get('soilType', '')).lower()
    soil_quality_map = {
        'loam': 1.3,     # Best overall for most crops
        'silt': 1.2,     # Good water retention and fertility
        'clay': 1.0,     # Can be productive but challenging
        'sandy': 0.8,    # Poor water retention
        'other': 0.9     # Unknown or mixed
    }
    soil_factor = soil_quality_map.get(soil_type, 1.0)

    water_source = str(farmer_data.get('waterSource', '')).lower()
    water_source_map = {
        'irrigation': 1.3,    # Most reliable
        'well': 1.2,          # Fairly reliable
        'river': 1.0,         # Can be seasonal
        'rain': 0.8,          # Highest variability
        'other': 0.9          # Unknown
    }
    water_factor = water_source_map.get(water_source, 1.0)

    # ------------------ Crop Factors ------------------
    crop_type = str(farmer_data.get('crop_type', 'Other')).title()
    crop_profitability = {
        "Wheat": 1.0,
        "Rice": 1.05,
        "Corn": 1.1,
        "Soybean": 1.05,
        "Cotton": 1.15,
        "Sugarcane": 1.3,
        "Other": 0.95
    }
    crop_factor = crop_profitability.get(crop_type, 1.0)

    try:
        last_yield = float(farmer_data.get('lastYieldAmount', 0))
    except (ValueError, TypeError):
        last_yield = 0

    avg_yields = {
        "Wheat": 3.0,     # tons per acre
        "Rice": 4.0,
        "Corn": 5.0,
        "Soybean": 2.5,
        "Cotton": 0.8,
        "Sugarcane": 30.0,
        "Other": 3.0
    }
    avg_yield = avg_yields.get(crop_type, 3.0)

    if last_yield > avg_yield * 1.5:
        yield_factor = 1.3  # Exceptional yield
    elif last_yield > avg_yield * 1.2:
        yield_factor = 1.2  # Excellent yield
    elif last_yield > avg_yield:
        yield_factor = 1.1  # Above average
    elif last_yield > avg_yield * 0.8:
        yield_factor = 1.0  # Average
    elif last_yield > avg_yield * 0.6:
        yield_factor = 0.9  # Below average
    else:
        yield_factor = 0.8  # Poor yield

    # ------------------ Farming Practices ------------------
    techniques = farmer_data.get('techniques', [])
    if not isinstance(techniques, list):
        techniques = [techniques] if techniques else []

    technique_factor = 1.0
    if 'precision' in techniques:
        technique_factor += 0.2  # Precision farming increases efficiency
    if 'noTill' in techniques:
        technique_factor += 0.1  # No-till improves soil health
    if 'organic' in techniques:
        technique_factor += 0.1  # Organic can command premium prices

    equipment_owned = str(farmer_data.get('equipmentOwned', '')).lower()
    if equipment_owned == 'owned':
        equipment_factor = 1.2  # Owns all equipment
    elif equipment_owned == 'partial':
        equipment_factor = 1.1  # Owns some equipment
    elif equipment_owned == 'rented':
        equipment_factor = 1.0  # Rents equipment
    else:  # None or unknown
        equipment_factor = 0.8

    # ------------------ Location and Climate Factors ------------------
    district = str(farmer_data.get('district', '')).title()
    district_ratings = {
        "Ahmedabad": 1.1,
        "Surat": 1.15,
        "Vadodara": 1.05,
        "Rajkot": 1.1,
        "Bhavnagar": 1.0,
        "Jamnagar": 0.95,
        "Junagadh": 1.05,
        "Gandhinagar": 1.0,
        "Kutch": 0.9,
        "Anand": 1.2
    }
    district_factor = district_ratings.get(district, 1.0)

    climate_issues = farmer_data.get('climateIssues', [])
    if not isinstance(climate_issues, list):
        climate_issues = [climate_issues] if climate_issues else []

    if len(climate_issues) >= 3:
        climate_factor = 0.85  # Multiple serious climate challenges
    elif len(climate_issues) == 2:
        climate_factor = 0.9   # Two climate challenges
    elif len(climate_issues) == 1:
        climate_factor = 0.95  # One climate challenge
    else:
        climate_factor = 1.05  # No reported climate challenges

    try:
        month = int(farmer_data.get('month', 0))
    except (ValueError, TypeError):
        month = 0

    season_factor = 1.0
    season_peaks = {
        "Wheat": [11, 12, 1, 2],  # Winter
        "Rice": [6, 7, 8, 9],     # Monsoon
        "Corn": [6, 7, 8],        # Summer-Monsoon
        "Soybean": [6, 7, 8],     # Summer-Monsoon
        "Cotton": [5, 6, 7, 8],   # Summer
        "Sugarcane": [2, 3, 4, 5]  # Spring
    }
    if month in season_peaks.get(crop_type, []):
        season_factor = 1.1  # Optimal growing season

    # ------------------ Revised Final Score Calculation ------------------
    # Instead of a straight weighted average, we compute how far each factor deviates
    # from the baseline of 1, weight these deviations, and then amplify the overall deviation.
    # This amplified deviation is then added to 1 and multiplied by the base score.
    #
    # With a base_score (typically 500), we want the multiplier (weighted_factor)
    # to range roughly from 0.6 (giving 300) to 1.7 (giving 850).
    #
    # Define weights for each factor (you can adjust these as needed):
    weights = {
        "experience": 0.20,
        "size": 0.15,
        "ownership": 0.20,
        "soil": 0.15,
        "water": 0.15,
        "crop": 0.10,
        "yield": 0.25,
        "technique": 0.10,
        "equipment": 0.10,
        "district": 0.10,
        "climate": 0.10,
        "season": 0.10
    }

    # Calculate the weighted deviation from the baseline (which is 1 for each factor)
    deviation_sum = (
        weights["experience"] * (experience_factor - 1) +
        weights["size"] * (size_factor - 1) +
        weights["ownership"] * (ownership_factor - 1) +
        weights["soil"] * (soil_factor - 1) +
        weights["water"] * (water_factor - 1) +
        weights["crop"] * (crop_factor - 1) +
        weights["yield"] * (yield_factor - 1) +
        weights["technique"] * (technique_factor - 1) +
        weights["equipment"] * (equipment_factor - 1) +
        weights["district"] * (district_factor - 1) +
        weights["climate"] * (climate_factor - 1) +
        weights["season"] * (season_factor - 1)
    )
    
    # Scaling factor to amplify the deviation
    scale_factor = 3.0  # Adjust this value to control sensitivity

    # The overall multiplier becomes:
    weighted_factor = 1 + scale_factor * deviation_sum

    # Compute the raw score
    weighted_score = base_score * weighted_factor

    # Clamp the final score between 300 and 850
    final_score = max(300, min(850, weighted_score))

    # ------------------ Factor Percentages for UI ------------------
    try:
        factor_percentages = {
            "location_quality": round(((district_factor - 0.8) / 0.6) * 100),
            "soil_health": round(((soil_factor - 0.7) / 0.6) * 100),
            "water_availability": round(((water_factor - 0.7) / 0.6) * 100),
            "climate_resilience": round(((climate_factor - 0.8) / 0.4) * 100)
        }
        for key in factor_percentages:
            factor_percentages[key] = max(0, min(100, factor_percentages[key]))
    except Exception as e:
        print(f"Error calculating factor percentages: {e}")
        factor_percentages = {
            "location_quality": 75,
            "soil_health": 80,
            "water_availability": 70,
            "climate_resilience": 65
        }

    return round(final_score, 0), factor_percentages


def recommend_loan(new_score, crop_type="Generic"):
    """
    Generate a recommendation based on credit score and crop type.
    """
    if not crop_type or not isinstance(crop_type, str):
        crop_type = "Generic"

    if new_score >= 750:
        return f"✅ Congratulations! You qualify for premium low-interest loans. Consider an expansion loan to grow more {crop_type} or invest in modern equipment."
    elif new_score >= 650:
        return f"🔧 You qualify for standard crop loans. Focus on maximizing yield for {crop_type}, and upgrading your irrigation systems could improve productivity."
    elif new_score >= 550:
        return f"⚡ You qualify for basic loans. Consider a crop loan to stabilize your {crop_type} output and improve your credit score over time."
    elif new_score >= 450:
        return f"⚠️ Limited loan options available. Your {crop_type} farm shows potential, but consider improving soil quality and water management for better scores."
    else:
        return f"🚨 Emergency loan suggested. Your credit score is low — focus on essential inputs for {crop_type} to ensure minimum yield this season."
