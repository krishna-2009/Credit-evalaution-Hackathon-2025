# FarmCredit - Alternative Credit Evaluation Tool

## Overview
Traditional credit evaluation methods often do not account for the unique realities of farming communities. FarmCredit presents an Alternative Credit Evaluation Tool that integrates non-traditional data sources—such as live GIS data, weather forecasts, and soil health metrics—to create a more inclusive, transparent, and accurate credit scoring system for farmers. The goal is to empower financial institutions to better assess credit risk while offering fair credit options to farmers.

## Key Features
- **Alternative Data Analysis**: Utilizes farm size, crop yield, climate resilience, and other farming-specific data points
- **GIS Integration**: Incorporates geographical data to evaluate land quality and environmental factors
- **Multi-Factor Credit Scoring**: Provides comprehensive credit scores based on various farming parameters
- **Carbon Credits Integration**: Includes carbon credits as a factor in credit evaluation
- **Interactive Dashboard**: Easy-to-use interface for bankers to evaluate farmers and manage loan applications
- **Loan Recommendations**: Intelligent suggestions for appropriate loan products based on credit evaluation

## How to Run the Project

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, or Safari)
- No server setup required for basic demonstration (runs on client-side)

### Installation Steps
1. Download or clone the repository to your local machine or download and extract the ZIP file

2. Navigate to the project directory

3. No build process required - the application runs directly in the browser

### Running the Application

1. **Open the landing page**:
- Double-click on `index.html` to open it in your default browser
- Alternatively, right-click and select "Open with" your preferred browser

2. **Navigate through different user journeys**:
- **For farmers**: Click on "Get Your Credit Score" on the landing page
- **For bankers**: Click on "Login" and use the banker login option

### User Workflow

#### Farmer Journey
1. From the landing page (`index.html`), click on "Get Your Credit Score"
2. Complete the three-step form with your farm details:
- Farm Details (size, ownership, years in farming)
- Location & Climate (address, soil type, water source)
- Crops & Yield (crop types, farming techniques, carbon credits)
3. Submit the form to receive your credit evaluation
4. View your credit score, score factors, and loan recommendations
5. Create an account or download your credit report

#### Banker Journey
1. From the landing page, click on "Login"
2. Select "I am a Banker" during signup or log in with existing banker credentials
3. Access the banker dashboard with the following features:
- Overview of loan applications and statistics
- Evaluate farmers using the alternative credit evaluation tool
- Review and approve/reject loan applications
- Access analytics and reports
- Manage system settings

## Project Structure

- **Landing Page**: `index.html` - Entry point to the application
- **Farmer Credit Score**: `credit-score.html` - Tool for farmers to get their credit score
- **Banker Dashboard**: `dashboard.html` - Main interface for bankers
- **Farmer Evaluation**: `evaluate-farmer.html` - Tool for bankers to evaluate farmers
- **Applications Management**: `applications.html` - For managing loan applications
- **Analytics**: `analytics.html` - Data insights and reporting
- **GIS Analysis**: `gis-analytics.html` - Geographical information analysis
- **Settings**: `settings.html` - System configuration options

### JavaScript Files
- `js/credit-score.js` - Handles the credit scoring form and calculations
- `js/dashboard.js` - Controls dashboard functionality
- `js/evaluate-farmer.js` - Manages the farmer evaluation process
- `js/gis-analytics.js` - Provides geographical data analysis

### CSS Files
- `css/landing.css` - Styles for the landing page
- `css/dashboard.css` - Styles for the dashboard interface
- `css/credit-score.css` - Styles for the credit score form and results

## Key Implementation Details

1. **Carbon Credits Factor**:
- Added as a new input field in the credit score form
- Integrated into the credit evaluation algorithm
- Provides additional weight for environmentally conscious farmers

2. **Alternative Data Sources**:
- Farm size and ownership status
- Geographical location and climate challenges
- Crop yield history and farming techniques
- Equipment ownership and technological adoption
- Carbon credits and sustainable farming practices

## Developed By
Team Name: Manual Matics  
Members: 
- Het Patel (@het-patel-0506)
- Krishna Patel (@krishna-2009)
- Aagam Shah (@Aagam2)
- Dhruv Hingu (@dhruvhingu)

## License
This project is licensed under the MIT License - see the LICENSE file for details.