import csv

def calculate_new_credit_score(farmer_data):
    """
    Calculate a credit score based on comprehensive farm data.
    
    Parameters:
    - farmer_data: A dictionary containing all form fields from the credit score form
    
    Returns:
    - A calculated credit score (float)
    """
    # Initialize base score (typically between 300-850 for credit scores)
    base_score = farmer_data.get('current_score', 500)
    
    # ==================== FARMER EXPERIENCE FACTORS ====================
    # Years in farming (experience matters)
    farm_age = int(farmer_data.get('farmAge', 0))
    experience_factor = 0.0
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
        
    # ==================== FARM CHARACTERISTICS FACTORS ====================
    # Farm size (larger farms may have more stability)
    farm_size = float(farmer_data.get('farmSize', 1))
    size_factor = 0.0
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
    
    # Land ownership status (owned land is more stable collateral)
    ownership_status = farmer_data.get('ownershipStatus', 'leased')
    ownership_factor = 0.0
    if ownership_status == 'owned':
        ownership_factor = 1.2
    elif ownership_status == 'partial':
        ownership_factor = 1.1
    else:  # leased
        ownership_factor = 0.9
    
    # ==================== SOIL AND WATER FACTORS ====================
    # Soil quality (better soil = better yield potential)
    soil_type = farmer_data.get('soilType', '')
    soil_factor = 0.0
    soil_quality_map = {
        'loam': 1.3,     # Best overall for most crops
        'silt': 1.2,     # Good water retention and fertility
        'clay': 1.0,     # Can be productive but challenging
        'sandy': 0.8,    # Poor water retention
        'other': 0.9     # Unknown or mixed
    }
    soil_factor = soil_quality_map.get(soil_type.lower(), 1.0)
    
    # Water source reliability (reliable water = stable production)
    water_source = farmer_data.get('waterSource', '')
    water_factor = 0.0
    water_source_map = {
        'irrigation': 1.3,    # Most reliable
        'well': 1.2,          # Fairly reliable
        'river': 1.0,         # Can be seasonal
        'rain': 0.8,          # Highest variability
        'other': 0.9          # Unknown
    }
    water_factor = water_source_map.get(water_source.lower(), 1.0)
    
    # ==================== CROP FACTORS ====================
    # Crop type profitability and market stability
    crop_type = farmer_data.get('crop_type', '')
    crop_factor = 0.0
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
    
    # Yield history (higher yields suggest better farm management)
    last_yield = float(farmer_data.get('lastYieldAmount', 0))
    yield_factor = 0.0
    # Adjust based on crop type average yields
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
    
    # Compare farmer's yield to average
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
    
    # ==================== FARMING PRACTICES ====================
    # Farming techniques (modern practices can reduce risk)
    techniques = farmer_data.get('techniques', [])
    technique_factor = 1.0
    if 'precision' in techniques:
        technique_factor += 0.2  # Precision farming increases efficiency
    if 'noTill' in techniques:
        technique_factor += 0.1  # No-till improves soil health
    if 'organic' in techniques:
        technique_factor += 0.1  # Organic can command premium prices
    
    # Equipment ownership (owned equipment reduces operational costs)
    equipment_owned = farmer_data.get('equipmentOwned', '')
    equipment_factor = 0.0
    if equipment_owned == 'owned':
        equipment_factor = 1.2  # Owns all equipment
    elif equipment_owned == 'partial':
        equipment_factor = 1.1  # Owns some equipment
    elif equipment_owned == 'rented':
        equipment_factor = 1.0  # Rents equipment
    else:  # none
        equipment_factor = 0.8  # No modern equipment
    
    # ==================== LOCATION AND CLIMATE FACTORS ====================
    # District/location factor (some areas have better infrastructure)
    district = farmer_data.get('district', '')
    district_factor = 1.0  # Default for unknown districts
    
    # Hardcoded district ratings based on agricultural productivity
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
    
    # Climate challenges (more challenges = more risk)
    climate_issues = farmer_data.get('climateIssues', [])
    climate_factor = 1.0
    if len(climate_issues) >= 3:
        climate_factor = 0.85  # Multiple serious climate challenges
    elif len(climate_issues) == 2:
        climate_factor = 0.9   # Two climate challenges
    elif len(climate_issues) == 1:
        climate_factor = 0.95  # One climate challenge
    else:
        climate_factor = 1.05  # No reported climate challenges
    
    # Seasonality factor (certain months are better for specific crops)
    month = farmer_data.get('month', 0)
    season_factor = 1.0
    
    # Crop-specific optimal growing seasons
    season_peaks = {
        "Wheat": [11, 12, 1, 2],  # Winter
        "Rice": [6, 7, 8, 9],     # Monsoon
        "Corn": [6, 7, 8],        # Summer-Monsoon
        "Soybean": [6, 7, 8],     # Summer-Monsoon
        "Cotton": [5, 6, 7, 8],   # Summer
        "Sugarcane": [2, 3, 4, 5], # Spring
    }
    
    if month in season_peaks.get(crop_type, []):
        season_factor = 1.1  # Optimal planting/growing season
    
    # ==================== FINAL SCORE CALCULATION ====================
    # Weight the factors based on importance (sum of weights = 1.0)
    weighted_score = base_score * (
        0.15 * experience_factor +   # Experience is important
        0.10 * size_factor +         # Farm size matters but less than experience
        0.10 * ownership_factor +    # Land ownership is significant
        0.10 * soil_factor +         # Soil quality affects yield
        0.05 * water_factor +        # Water source reliability
        0.10 * crop_factor +         # Crop type affects profitability
        0.15 * yield_factor +        # Previous yields strongly indicate future performance
        0.05 * technique_factor +    # Farming techniques matter
        0.05 * equipment_factor +    # Equipment affects efficiency
        0.05 * district_factor +     # Location matters 
        0.05 * climate_factor +      # Climate challenges pose risks
        0.05 * season_factor         # Seasonality affects timing
    )
    
    # Ensure the score stays within a reasonable range (300-850)
    final_score = max(300, min(850, weighted_score))
    
    return round(final_score, 0)


def recommend_loan(new_score, crop_type):
    """
    Generate a recommendation based on credit score and crop type.
    """
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
