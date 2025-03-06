import pandas as pd
import datetime
import random

class DataStore:
    def __init__(self):
        self.df = self.load_factory_data()
        self.last_update = datetime.datetime.now()
    
    def load_factory_data(self):
        """Load factory data from CSV file"""
        try:
            df = pd.read_csv("C:\\Users\\athar\\OneDrive\\Documents\\CascadeProjects\\windsurf-project\\FoamFactory_V2_27K.csv")
            # Convert Date to datetime
            df['Date'] = pd.to_datetime(df['Date'])
            return df
        except Exception as e:
            print(f"Error loading CSV data: {e}")
            return pd.DataFrame()
        
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

# Create a singleton instance
data_store = DataStore()

