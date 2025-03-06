from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Union
import random
import datetime
import uuid
import os
import json
import pandas as pd
from io import StringIO

app = FastAPI(title="Factory Management API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class TimeSeriesData(BaseModel):
    name: str
    production: float
    efficiency: float
    downtime: float

class FactoryMetrics(BaseModel):
    production: float
    efficiency: float
    downtime: float
    profitMargin: float
    timeSeriesData: List[TimeSeriesData]

class FactoryStatus(BaseModel):
    id: str
    name: str
    status: str  # 'operational', 'warning', 'down'
    efficiency: str
    lastMaintenance: str

class BotMessageRequest(BaseModel):
    message: str

class BotResponse(BaseModel):
    message: str

# CSV data
# CSV_DATA = """Factory,Date,Location,Machine Type,Machine Utilization (%),Machine Downtime (hours),Maintenance History,Machine Age (years),Batch,Batch Quality (Pass %),Cycle Time (minutes),Energy Consumption (kWh),Energy Efficiency Rating,CO2 Emissions (kg),Emission Limit Compliance,Waste Generated (kg),Water Usage (liters),Shift,Operator Experience (years),Team Size,Team Members,Operator Training Level,Absenteeism Rate (%),Product Category,Supplier,Supplier Delays (days),Raw Material Quality,Market Demand Index,Cost of Downtime ($),Revenue ($),Profit Margin (%),Breakdowns (count),Safety Incidents (count),Production Volume (units),Defect Rate (%),Temperature (C),Pressure (psi),Chemical Ratio,Mixing Speed (RPM)
# Factory 1,2020-01-01,Location A,Type 2,53,0.0,Irregular,8.89,Batch 1,89.74,20,877,1,867,No,300,6000,Shift 1,5.22,4,"[{'Name': 'Member_0_0', 'Operator Experience (years)': 10.0, 'Operator Training Level': 3.6, 'Absenteeism Rate (%)': 0.45}, {'Name': 'Member_0_1', 'Operator Experience (years)': 3.6, 'Operator Training Level': 2.7, 'Absenteeism Rate (%)': 3.6}, {'Name': 'Member_0_2', 'Operator Experience (years)': 4.4, 'Operator Training Level': 1.6, 'Absenteeism Rate (%)': 3.6}, {'Name': 'Member_0_3', 'Operator Experience (years)': 2.9, 'Operator Training Level': 1.3, 'Absenteeism Rate (%)': 3.3}]",2.3,2.74,Category B,Supplier X,0,0,50,0.0,377589.2,12.63,4.75,3.76,629.39,7.08,65.0,150.0,3.0,200.0
# Factory 1,2020-01-01,Location A,Type 1,59,0.0,Irregular,6.34,Batch 2,91.68,10,665,2,826,No,100,2000,Shift 2,4.7,4,"[{'Name': 'Member_1_0', 'Operator Experience (years)': 8.2, 'Operator Training Level': 4.4, 'Absenteeism Rate (%)': 1.52}, {'Name': 'Member_1_1', 'Operator Experience (years)': 4.6, 'Operator Training Level': 2.2, 'Absenteeism Rate (%)': 1.3}, {'Name': 'Member_1_2', 'Operator Experience (years)': 3.4, 'Operator Training Level': 1.7, 'Absenteeism Rate (%)': 6.1}, {'Name': 'Member_1_3', 'Operator Experience (years)': 2.6, 'Operator Training Level': 1.7, 'Absenteeism Rate (%)': 3.8}]",4.8,3.18,Category A,Supplier Z,0,0,70,0.0,332527.05,20.76,4.16,2.98,665.16,7.71,65.0,150.0,3.0,200.0
# Factory 1,2020-01-01,Location A,Type 2,53,0.0,Irregular,8.89,Batch 3,89.58,20,877,1,867,No,300,6000,Shift 3,5.65,4,"[{'Name': 'Member_2_0', 'Operator Experience (years)': 8.9, 'Operator Training Level': 4.4, 'Absenteeism Rate (%)': 1.85}, {'Name': 'Member_2_1', 'Operator Experience (years)': 6.6, 'Operator Training Level': 2.9, 'Absenteeism Rate (%)': 4.8}, {'Name': 'Member_2_2', 'Operator Experience (years)': 4.3, 'Operator Training Level': 1.6, 'Absenteeism Rate (%)': 4.0}, {'Name': 'Member_2_3', 'Operator Experience (years)': 2.8, 'Operator Training Level': 1.2, 'Absenteeism Rate (%)': 0.1}]",7.32,2.69,Category B,Supplier X,0,0,50,0.0,370480.16,12.63,4.72,3.2,617.54,7.06,65.0,150.1,3.0,200.0
# Factory 1,2020-01-02,Location A,Type 1,59,0.0,Irregular,6.34,Batch 4,92.43,10,665,2,826,No,100,2000,Shift 1,3.95,4,"[{'Name': 'Member_3_0', 'Operator Experience (years)': 6.2, 'Operator Training Level': 3.4, 'Absenteeism Rate (%)': 1.99}, {'Name': 'Member_3_1', 'Operator Experience (years)': 3.5, 'Operator Training Level': 3.8, 'Absenteeism Rate (%)': 1.2}, {'Name': 'Member_3_2', 'Operator Experience (years)': 2.6, 'Operator Training Level': 2.6, 'Absenteeism Rate (%)': 1.7}, {'Name': 'Member_3_3', 'Operator Experience (years)': 3.5, 'Operator Training Level': 1.5, 'Absenteeism Rate (%)': 3.3}]",10.15,2.05,Category A,Supplier Z,0,0,70,0.0,355045.91,20.58,3.59,2.4,710.21,8.09,65.0,150.0,3.1,200.0
# Factory 1,2020-01-02,Location A,Type 3,57,0.5,Irregular,7.05,Batch 5,87.9,30,932,1,774,No,500,10000,Shift 2,3.82,4,"[{'Name': 'Member_4_0', 'Operator Experience (years)': 6.0, 'Operator Training Level': 3.4, 'Absenteeism Rate (%)': 1.37}, {'Name': 'Member_4_1', 'Operator Experience (years)': 7.5, 'Operator Training Level': 3.1, 'Absenteeism Rate (%)': 3.1}, {'Name': 'Member_4_2', 'Operator Experience (years)': 1.8, 'Operator Training Level': 1.4, 'Absenteeism Rate (%)': 2.6}, {'Name': 'Member_4_3', 'Operator Experience (years)': 0.0, 'Operator Training Level': 1.6, 'Absenteeism Rate (%)': 0.5}]",12.52,1.89,Category C,Supplier Z,10,1,150,33386.11,534135.2,26.35,4.26,3.14,667.72,6.36,65.0,150.0,3.0,200.0
# Factory 1,2020-01-02,Location A,Type 2,53,0.0,Irregular,8.89,Batch 6,90.03,20,877,1,867,No,300,6000,Shift 3,4.7,4,"[{'Name': 'Member_5_0', 'Operator Experience (years)': 6.6, 'Operator Training Level': 3.3, 'Absenteeism Rate (%)': 1.69}, {'Name': 'Member_5_1', 'Operator Experience (years)': 5.6, 'Operator Training Level': 3.5, 'Absenteeism Rate (%)': 1.1}, {'Name': 'Member_5_2', 'Operator Experience (years)': 1.8, 'Operator Training Level': 1.4, 'Absenteeism Rate (%)': 2.2}, {'Name': 'Member_5_3', 'Operator Experience (years)': 4.8, 'Operator Training Level': 2.0, 'Absenteeism Rate (%)': 5.1}]",15.08,2.52,Category B,Supplier X,0,0,50,0.0,389617.11,12.6,4.64,2.41,649.44,7.18,65.0,150.0,3.0,200.0
# Factory 1,2020-01-03,Location A,Type 3,57,0.5,Irregular,7.05,Batch 7,86.83,30,932,1,774,No,500,10000,Shift 1,5.95,4,"[{'Name': 'Member_6_0', 'Operator Experience (years)': 9.7, 'Operator Training Level': 4.0, 'Absenteeism Rate (%)': 1.07}, {'Name': 'Member_6_1', 'Operator Experience (years)': 4.6, 'Operator Training Level': 3.8, 'Absenteeism Rate (%)': 3.6}, {'Name': 'Member_6_2', 'Operator Experience (years)': 5.6, 'Operator Training Level': 2.6, 'Absenteeism Rate (%)': 2.2}, {'Name': 'Member_6_3', 'Operator Experience (years)': 3.9, 'Operator Training Level': 1.3, 'Absenteeism Rate (%)': 2.9}]",18.0,2.44,Category C,Supplier Z,10,1,150,29648.61,474341.88,26.44,4.53,2.7,592.97,6.04,65.0,150.0,3.0,200.0
# Factory 1,2020-01-03,Location A,Type 3,57,0.5,Irregular,7.05,Batch 8,86.22,30,932,1,774,No,500,10000,Shift 2,5.78,4,"[{'Name': 'Member_7_0', 'Operator Experience (years)': 9.2, 'Operator Training Level': 4.4, 'Absenteeism Rate (%)': 1.63}, {'Name': 'Member_7_1', 'Operator Experience (years)': 6.3, 'Operator Training Level': 2.3, 'Absenteeism Rate (%)': 2.6}, {'Name': 'Member_7_2', 'Operator Experience (years)': 5.9, 'Operator Training Level': 2.1, 'Absenteeism Rate (%)': 6.3}, {'Name': 'Member_7_3', 'Operator Experience (years)': 1.7, 'Operator Training Level': 1.6, 'Absenteeism Rate (%)': 6.1}]",20.6,4.16,Category C,Supplier Z,10,1,150,28196.11,451106.26,26.61,5.39,4.15,563.92,5.57,65.0,150.0,3.0,200.0
# Factory 1,2020-01-03,Location A,Type 3,57,0.5,Irregular,7.05,Batch 9,86.85,30,932,1,774,No,500,10000,Shift 3,5.03,4,"[{'Name': 'Member_8_0', 'Operator Experience (years)': 5.9, 'Operator Training Level': 4.6, 'Absenteeism Rate (%)': 2.35}, {'Name': 'Member_8_1', 'Operator Experience (years)': 4.6, 'Operator Training Level': 2.1, 'Absenteeism Rate (%)': 4.7}, {'Name': 'Member_8_2', 'Operator Experience (years)': 5.3, 'Operator Training Level': 1.4, 'Absenteeism Rate (%)': 4.4}, {'Name': 'Member_8_3', 'Operator Experience (years)': 4.3, 'Operator Training Level': 1.6, 'Absenteeism Rate (%)': 1.9}]",23.02,3.34,Category C,Supplier Z,10,1,150,30141.11,482222.35,26.52,4.98,2.87,602.82,5.86,65.0,150.0,3.0,200.0
# Factory 1,2020-01-04,Location A,Type 1,59,0.0,Irregular,6.34,Batch 10,91.39,10,665,2,826,No,100,2000,Shift 1,4.6,4,"[{'Name': 'Member_9_0', 'Operator Experience (years)': 8.3, 'Operator Training Level': 3.5, 'Absenteeism Rate (%)': 1.58}, {'Name': 'Member_9_1', 'Operator Experience (years)': 3.9, 'Operator Training Level': 2.2, 'Absenteeism Rate (%)': 4.3}, {'Name': 'Member_9_2', 'Operator Experience (years)': 2.1, 'Operator Training Level': 2.9, 'Absenteeism Rate (%)': 4.6}, {'Name': 'Member_9_3', 'Operator Experience (years)': 4.1, 'Operator Training Level': 1.0, 'Absenteeism Rate (%)': 5.5}]",25.42,4.0,Category A,Supplier Z,0,0,70,0.0,325829.52,20.88,4.57,4.12,651.76,7.49,65.0,149.9,3.0,200.0
# Factory 1,2020-01-04,Location A,Type 1,59,0.0,Irregular,6.34,Batch 11,91.54,10,665,2,826,No,100,2000,Shift 2,6.15,4,"[{'Name': 'Member_10_0', 'Operator Experience (years)': 9.9, 'Operator Training Level': 3.6, 'Absenteeism Rate (%)': 0.88}, {'Name': 'Member_10_1', 'Operator Experience (years)': 7.9, 'Operator Training Level': 3.8, 'Absenteeism Rate (%)': 3.3}, {'Name': 'Member_10_2', 'Operator Experience (years)': 5.7, 'Operator Training Level': 2.1, 'Absenteeism Rate (%)': 2.2}, {'Name': 'Member_10_3', 'Operator Experience (years)': 1.1, 'Operator Training Level': 1.8, 'Absenteeism Rate (%)': 1.9}]",28.25,2.07,Category A,Supplier Z,0,0,70,0.0,321677.48,20.63,3.6,3.13,643.46,7.91,65.0,150.0,3.0,200.2
# Factory 1,2020-01-04,Location A,Type 3,57,0.5,Irregular,7.05,Batch 12,86.42,30,932,1,774,No,500,10000,Shift 3,5.12,4,"[{'Name': 'Member_11_0', 'Operator Experience (years)': 6.6, 'Operator Training Level': 3.4, 'Absenteeism Rate (%)': 2.46}, {'Name': 'Member_11_1', 'Operator Experience (years)': 7.9, 'Operator Training Level': 3.6, 'Absenteeism Rate (%)': 2.5}, {'Name': 'Member_11_2', 'Operator Experience (years)': 3.4, 'Operator Training Level': 2.0, 'Absenteeism Rate (%)': 6.2}, {'Name': 'Member_11_3', 'Operator Experience (years)': 2.6, 'Operator Training Level': 1.0, 'Absenteeism Rate (%)': 6.0}]",30.75,4.29,Category C,Supplier Z,10,1,150,29028.61,464425.26,26.62,5.45,4.57,580.57,5.59,65.0,149.9,3.1,200.0
# Factory 1,2020-01-05,Location A,Type 3,57,0.5,Irregular,7.05,Batch 13,86.5,30,932,1,774,No,500,10000,Shift 1,6.02,4,"[{'Name': 'Member_12_0', 'Operator Experience (years)': 9.8, 'Operator Training Level': 3.3, 'Absenteeism Rate (%)': 0.63}, {'Name': 'Member_12_1', 'Operator Experience (years)': 8.0, 'Operator Training Level': 3.0, 'Absenteeism Rate (%)': 1.5}, {'Name': 'Member_12_2', 'Operator Experience (years)': 3.7, 'Operator Training Level': 2.3, 'Absenteeism Rate (%)': 2.5}, {'Name': 'Member_12_3', 'Operator Experience (years)': 2.6, 'Operator Training Level': 1.5, 'Absenteeism Rate (%)': 8.2}]",33.27,3.21,Category C,Supplier Z,10,1,150,28771.11,460304.21,26.52,4.91,3.14,575.42,5.82,65.0,150.0,3.0,200.0
# Factory 1,2020-01-05,Location A,Type 3,57,0.5,Irregular,7.05,Batch 14,86.73,30,932,1,774,No,500,10000,Shift 2,3.65,4,"[{'Name': 'Member_13_0', 'Operator Experience (years)': 5.3, 'Operator Training Level': 4.1, 'Absenteeism Rate (%)': 2.31}, {'Name': 'Member_13_1', 'Operator Experience (years)': 5.7, 'Operator Training Level': 3.2, 'Absenteeism Rate (%)': 4.7}, {'Name': 'Member_13_2', 'Operator Experience (years)': 2.0, 'Operator Training Level': 3.0, 'Absenteeism Rate (%)': 4.6}, {'Name': 'Member_13_3', 'Operator Experience (years)': 1.6, 'Operator Training Level': 2.0, 'Absenteeism Rate (%)': 8.2}]",36.35,4.95,Category C,Supplier Z,10,1,150,30563.61,488983.97,26.67,5.79,3.98,611.27,5.52,65.2,150.0,2.9,200.0
# Factory 1,2020-01-05,Location A,Type 1,59,0.0,Irregular,6.34,Batch 15,92.18,10,665,2,826,No,100,2000,Shift 3,3.9,4,"[{'Name': 'Member_14_0', 'Operator Experience (years)': 5.2, 'Operator Training Level': 4.1, 'Absenteeism Rate (%)': 0.29}, {'Name': 'Member_14_1', 'Operator Experience (years)': 4.0, 'Operator Training Level': 2.2, 'Absenteeism Rate (%)': 4.0}, {'Name': 'Member_14_2', 'Operator Experience (years)': 2.4, 'Operator Training Level': 2.9, 'Absenteeism Rate (%)': 3.9}, {'Name': 'Member_14_3', 'Operator Experience (years)': 4.0, 'Operator Training Level': 1.1, 'Absenteeism Rate (%)': 2.7}]",38.92,2.72,Category A,Supplier Z,0,0,70,0.0,349098.15,20.68,3.93,2.73,698.31,7.91,65.0,150.0,3.0,200.0
# Factory 1,2020-01-06,Location A,Type 3,57,0.5,Irregular,7.05,Batch 16,87.08,30,932,1,774,No,500,10000,Shift 1,5.58,4,"[{'Name': 'Member_15_0', 'Operator Experience (years)': 7.6, 'Operator Training Level': 3.4, 'Absenteeism Rate (%)': 2.5}, {'Name': 'Member_15_1', 'Operator Experience (years)': 7.8, 'Operator Training Level': 3.7, 'Absenteeism Rate (%)': 4.3}, {'Name': 'Member_15_2', 'Operator Experience (years)': 5.8, 'Operator Training Level': 1.4, 'Absenteeism Rate (%)': 0.7}, {'Name': 'Member_15_3', 'Operator Experience (years)': 1.1, 'Operator Training Level': 1.2, 'Absenteeism Rate (%)': 1.2}]",41.35,2.17,Category C,Supplier Z,10,1,150,30458.61,487300.28,26.4,4.4,2.47,609.17,6.14,65.2,150.0,3.0,200.0
# Factory 1,2020-01-06,Location A,Type 1,59,0.0,Irregular,6.34,Batch 17,91.7,10,665,2,826,No,100,2000,Shift 2,4.92,4,"[{'Name': 'Member_16_0', 'Operator Experience (years)': 5.8, 'Operator Training Level': 4.4, 'Absenteeism Rate (%)': 0.65}, {'Name': 'Member_16_1', 'Operator Experience (years)': 6.1, 'Operator Training Level': 2.6, 'Absenteeism Rate (%)': 0.1}, {'Name': 'Member_16_2', 'Operator Experience (years)': 3.1, 'Operator Training Level': 2.3, 'Absenteeism Rate (%)': 4.4}, {'Name': 'Member_16_3', 'Operator Experience (years)': 4.7, 'Operator Training Level': 1.3, 'Absenteeism Rate (%)': 6.5}]",44.0,2.91,Category A,Supplier Z,0,0,70,0.0,331826.78,20.73,4.03,2.93,663.76,7.77,65.0,150.0,3.0,200.0
# Factory 1,2020-01-06,Location A,Type 3,57,0.5,Irregular,7.05,Batch 18,86.47,30,932,1,774,No,500,10000,Shift 3,5.08,4,"[{'Name': 'Member_17_0', 'Operator Experience (years)': 6.9, 'Operator Training Level': 3.4, 'Absenteeism Rate (%)': 1.5}, {'Name': 'Member_17_1', 'Operator Experience (years)': 7.5, 'Operator Training Level': 2.5, 'Absenteeism Rate (%)': 4.6}, {'Name': 'Member_17_2', 'Operator Experience (years)': 1.7, 'Operator Training Level': 2.4, 'Absenteeism Rate (%)': 6.6}, {'Name': 'Member_17_3', 'Operator Experience (years)': 4.2, 'Operator Training Level': 1.2, 'Absenteeism Rate (%)': 4.2}]",46.37,4.22,Category C,Supplier Z,10,1,150,29178.61,466824.95,26.61,5.42,4.57,583.57,5.61,65.0,150.0,3.0,200.0
# Factory 1,2020-01-07,Location A,Type 2,53,0.0,Irregular,8.89,Batch 19,90.18,20,877,1,867,No,300,6000,Shift 1,4.3,4,"[{'Name': 'Member_18_0', 'Operator Experience (years)': 8.7, 'Operator Training Level': 4.0, 'Absenteeism Rate (%)': 1.02}, {'Name': 'Member_18_1', 'Operator Experience (years)': 3.4, 'Operator Training Level': 3.3, 'Absenteeism Rate (%)': 4.5}, {'Name': 'Member_18_2', 'Operator Experience (years)': 1.0, 'Operator Training Level': 2.1, 'Absenteeism Rate (%)': 2.4}, {'Name': 'Member_18_3', 'Operator Experience (years)': 4.1, 'Operator Training Level': 1.8, 'Absenteeism Rate (%)': 2.3}]",49.17,2.55,Category B,Supplier X,0,0,50,0.0,396366.16,12.59,4.66,3.83,660.69,7.2,65.0,150.1,3.0,200.0"""

# Load CSV data into pandas DataFrame
def load_factory_data():
    try:
        df = pd.read_csv("C:\\Users\\athar\\OneDrive\\Documents\\CascadeProjects\\windsurf-project\\FoamFactory_V2_27K.csv")
        # Convert Date to datetime
        df['Date'] = pd.to_datetime(df['Date'])
        return df
    except Exception as e:
        print(f"Error loading CSV data: {e}")
        return pd.DataFrame()

# Data store class with pandas integration
class DataStore:
    def __init__(self):
        self.df = load_factory_data()
        self.last_update = datetime.datetime.now()
        
    def get_factory_metrics(self):
        """Get aggregated factory metrics from the DataFrame"""
        if self.df.empty:
            return self._initialize_metrics()
        
        # Calculate average metrics
        avg_production = round(self.df['Production Volume (units)'].mean(),2)
        avg_efficiency = self.df['Machine Utilization (%)'].mean()
        avg_downtime = self.df['Machine Downtime (hours)'].mean()
        avg_profit_margin = self.df['Profit Margin (%)'].mean()
        
        # Create time series data by date
        time_series = []
        for date, group in self.df.groupby(self.df['Date'].dt.date):
            time_series.append({
                "name": date.strftime("%Y-%m-%d"),
                "production": float(group['Production Volume (units)'].mean()),
                "efficiency": float(group['Machine Utilization (%)'].mean()),
                "downtime": float(group['Machine Downtime (hours)'].mean())
            })
        
        # Sort time series by date
        time_series = sorted(time_series, key=lambda x: x["name"])
        
        return {
            "production": float(avg_production),
            "efficiency": float(avg_efficiency),
            "downtime": float(avg_downtime),
            "profitMargin": float(avg_profit_margin),
            "timeSeriesData": time_series
        }
    
    def get_factory_status(self):
        """Get factory status from the DataFrame"""
        if self.df.empty:
            return self._initialize_status()
        
        # Get the latest data for each machine type
        latest_date = self.df['Date'].max()
        latest_data = self.df[self.df['Date'] == latest_date]
        
        status_list = []
        for i, row in latest_data.iterrows():
            # Determine status based on machine utilization
            if row['Machine Utilization (%)'] >= 55:
                status = "operational"
            elif row['Machine Utilization (%)'] >= 50:
                status = "warning"
            else:
                status = "down"
                
            status_list.append({
                "id": f"line-{i}",
                "name": f"{row['Machine Type']} - {row['Batch']}",
                "status": status,
                "efficiency": f"{row['Machine Utilization (%)']}%",
                "lastMaintenance": f"{row['Machine Age (years)']:.1f} years"
            })
            
        return status_list
    
    def _initialize_metrics(self):
        """Fallback method if data is not available"""
        time_series = [
            {
                "name": f"Day {i}",
                "production": round(random.uniform(1500, 4500), 2),
                "efficiency": round(random.uniform(65, 95), 2),
                "downtime": round(random.uniform(0.5, 5), 2)
            }
            for i in range(1, 31, 5)
        ]
        
        return {
            "production": round(random.uniform(1000, 1500), 2),
            "efficiency": round(random.uniform(85, 95), 2),
            "downtime": round(random.uniform(2, 4), 2),
            "profitMargin": round(random.uniform(20, 30), 2),
            "timeSeriesData": time_series
        }
    
    def _initialize_status(self):
        """Fallback method if data is not available"""
        statuses = ["operational", "warning", "down"]
        weights = [0.7, 0.2, 0.1]  # Probability weights for each status
        
        return [
            {
                "id": f"line-{i}",
                "name": f"Production Line {i}",
                "status": random.choices(statuses, weights=weights)[0],
                "efficiency": f"{random.randint(60, 98)}%" if i != 4 else "0%",
                "lastMaintenance": f"{random.randint(1, 14)} days ago"
            }
            for i in range(1, 6)
        ]

    def get_machine_types(self):
        """Get unique machine types from the DataFrame"""
        if self.df.empty:
            return ["Type 1", "Type 2", "Type 3"]
        
        return self.df['Machine Type'].unique().tolist()
    
    def get_batch_quality(self):
        """Get batch quality metrics"""
        if self.df.empty:
            return {"average": 85, "min": 80, "max": 95}
        
        return {
            "average": float(self.df['Batch Quality (Pass %)'].mean()),
            "min": float(self.df['Batch Quality (Pass %)'].min()),
            "max": float(self.df['Batch Quality (Pass %)'].max())
        }
    
    def get_energy_metrics(self):
        """Get energy consumption and efficiency metrics"""
        if self.df.empty:
            return {"consumption": 800, "efficiency": 1.5, "emissions": 800}
        
        return {
            "consumption": float(self.df['Energy Consumption (kWh)'].mean()),
            "efficiency": float(self.df['Energy Efficiency Rating'].mean()),
            "emissions": float(self.df['CO2 Emissions (kg)'].mean())
        }

# Initialize data store
data_store = DataStore()

import threading
import asyncio
from api.kg_rag import kg_rag

import os
from dotenv import load_dotenv

def initialize_graph():
    asyncio.run(kg_rag.init_graph())

# Initialize the graph in a separate thread
thread = threading.Thread(target=initialize_graph, daemon=True)
thread.start()

# Bot responses with more context awareness
def get_bot_response(message: str) -> str:
    return kg_rag.get_kg_answer(message)

def get_bot_response1(message: str) -> str:
    message = message.lower()
    
    # Get current metrics for context-aware responses
    metrics = data_store.get_factory_metrics()
    status = data_store.get_factory_status()
    batch_quality = data_store.get_batch_quality()
    energy_metrics = data_store.get_energy_metrics()
    
    # Check for production related queries
    if any(word in message for word in ["production", "output", "units"]):
        return f"Current production is at {metrics['production']:.2f} units. This is " + \
               ("above" if metrics['production'] > 600 else "below") + \
               " our target of 600 units. Efficiency is at {metrics['efficiency']:.2f}%."
    
    # Check for efficiency related queries
    elif any(word in message for word in ["efficiency", "performance"]):
        return f"Factory efficiency is currently at {metrics['efficiency']:.2f}%. " + \
               ("This is good!" if metrics['efficiency'] > 55 else "We should aim to improve this.") + \
               f" Our profit margin is {metrics['profitMargin']:.2f}%."
    
    # Check for downtime related queries
    elif any(word in message for word in ["downtime", "maintenance", "repair"]):
        return f"Current downtime is {metrics['downtime']:.2f} hours. " + \
               f"Some machines may require maintenance soon based on their age."
    
    # Check for status related queries
    elif any(word in message for word in ["status", "condition", "state"]):
        operational_count = sum(1 for line in status if line["status"] == "operational")
        warning_count = sum(1 for line in status if line["status"] == "warning")
        down_count = sum(1 for line in status if line["status"] == "down")
        
        return f"Currently, {operational_count} production lines are operational, " + \
               f"{warning_count} lines are showing warnings, and " + \
               f"{down_count} lines are down. Overall factory status is " + \
               ("good." if operational_count >= 3 else "concerning.")
    
    # Check for quality related queries
    elif any(word in message for word in ["quality", "batch quality", "pass rate"]):
        return f"The average batch quality pass rate is {batch_quality['average']:.2f}%. " + \
               f"Our best batch had a {batch_quality['max']:.2f}% pass rate, while our worst " + \
               f"had a {batch_quality['min']:.2f}% pass rate."
    
    # Check for energy related queries
    elif any(word in message for word in ["energy", "consumption", "emissions"]):
        return f"Average energy consumption is {energy_metrics['consumption']:.2f} kWh with an " + \
               f"efficiency rating of {energy_metrics['efficiency']:.2f}. " + \
               f"CO2 emissions average {energy_metrics['emissions']:.2f} kg."
    
    # Help command
    elif any(word in message for word in ["help", "assist", "command", "what can you"]):
        return "I can provide information about production rates, efficiency, downtime, line status, " + \
               "batch quality, and energy consumption. You can ask questions like 'What's our current production?', " + \
               "'How's our efficiency?', 'Any downtime issues?', 'What's the status of our lines?', " + \
               "'How's our batch quality?', or 'What's our energy consumption?'"
    
    # Default response
    else:
        return "I'm not sure I understand. You can ask about production, efficiency, downtime, status, " + \
               "batch quality, or energy consumption. Type 'help' for more information."

# Mount static files
app.mount("/static", StaticFiles(directory="api/static"), name="static")

# API Routes
@app.get("/api")
async def root():
    return {"message": "Factory Management API is running"}

@app.get("/api/factory/metrics", response_model=FactoryMetrics)
async def get_factory_metrics():
    metrics = data_store.get_factory_metrics()
    return metrics

@app.get("/api/factory/status", response_model=List[FactoryStatus])
async def get_factory_status():
    status = data_store.get_factory_status()
    return status

@app.get("/api/factory/machine-types")
async def get_machine_types():
    machine_types = data_store.get_machine_types()
    return {"machine_types": machine_types}

@app.get("/api/factory/batch-quality")
async def get_batch_quality():
    batch_quality = data_store.get_batch_quality()
    return batch_quality

@app.get("/api/factory/energy-metrics")
async def get_energy_metrics():
    energy_metrics = data_store.get_energy_metrics()
    return energy_metrics

@app.post("/api/factory/bot", response_model=BotResponse)
async def send_bot_message(request: BotMessageRequest):
    response_content = get_bot_response(request.message)
    
    return BotResponse(
        message=response_content['result']
    )

# Serve the frontend
@app.get("/{full_path:path}", response_class=HTMLResponse)
async def serve_frontend(request: Request, full_path: str):
    # If the path is for a specific file with extension, try to serve it
    if "." in full_path:
        file_path = os.path.join("api/static", full_path)
        if os.path.exists(file_path):
            return FileResponse(file_path)
    
    # Otherwise, serve the index.html for client-side routing
    index_path = os.path.join("api/static", "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r") as f:
            content = f.read()
        return HTMLResponse(content=content)
    
    # If index.html doesn't exist, return a simple message
    return HTMLResponse(content="<html><body><h1>Frontend not built yet</h1><p>Please build the frontend and place it in the static directory.</p></body></html>")

if __name__ == "__main__":
    import uvicorn
    
    # Create static directory if it doesn't exist
    os.makedirs("static", exist_ok=True)
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
