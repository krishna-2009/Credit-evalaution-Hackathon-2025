# Credit-evalaution-Hackathon-2025

## Overview
Traditional credit evaluation methods often do not account for the unique realities of farming communities. This project presents an Alternative Credit Evaluation Tool that integrates non-traditional data sources—such as live GIS data, weather forecasts, and soil health metrics—to create a more inclusive, transparent, and accurate credit scoring system. The goal is to empower financial institutions to better assess credit risk while offering fair credit options to farmers.

## Problem Statement
Traditional credit evaluation methods often fail to capture the unique challenges and opportunities faced by farmers. Factors such as land quality, weather patterns, and crop yield potential play a significant role in determining a farmer's creditworthiness. Your challenge is to design an Alternative Credit Evaluation Tool that incorporates non-traditional data sources such as live GIS (Geographic Information System) data, upcoming weather forecasts, soil health metrics, etc., to create a more inclusive credit scoring system for farming loans. The tool should help financial institutions assess risk more accurately and enable farmers to access fair and tailored credit options.

## Key Requirements
1. **Data Integration**  
   Utilize live GIS data, weather forecasts, soil health metrics, and past crop yields.

2. **Financial Risk Assessment**  
   Provide a transparent and explainable scoring system that financial institutions can trust.

3. **User Accessibility**  
   Ensure the tool is usable by banks, NBFCs, and farmers with minimal technical knowledge.

4. **Scalability & Adaptability**  
   Design the tool to work across different regions with diverse farming conditions.

5. **Regulatory Compliance**  
   Ensure adherence to financial regulations and data privacy laws.

## Project Structure
- **dashboard.html**  
  Main dashboard for bankers, displaying application stats, charts, and quick actions.
- **evaluate-farmer.html**  
  Form-driven UI to collect data about farmers’ personal details, farm info, financial history, and additional factors.
- **js/dashboard.js**  
  Handles dynamic dashboard elements (charts, notifications, real-time data updates).
- **js/evaluate-farmer.js**  
  Manages multi-step form navigation for evaluating farmers.
- **js/gis-analytics.js**  
  Integrates map-based layers (soil, water, yield) fetched from GIS data sources.
- **js/settings.js**  
  Manages user settings, notifications, theme toggles, and form validations.

## Getting Started
1. Clone this repository or download the project folder.
2. Open “dashboard.html” or “evaluate-farmer.html” in your browser to explore the tool’s UI and features.
3. (Optional) If you have a local server setup, place the project inside your web root and access it via your server URL.

## Contributing
Feel free to submit pull requests with improvements or new features. Please ensure changes adhere to the key requirements and overall project goals for consistent development.

## Developed By
Team Name: Manual Matics  
Members: 
- Krishna Patel (@krishna-2009)
- Het Patel (@het-patel-0506)
- Aagam Shah (@Aagam2)
- Dhruv Hingu (@dhruvhingu)