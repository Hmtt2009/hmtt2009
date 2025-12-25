# Forecast Manager

A browser-based data science simulation game where you play as a data scientist tasked with delivering an accurate 90-day sales forecast.

## Overview

**Forecast Manager** is an educational game that teaches real-world forecasting skills through gameplay. Over 10 in-game days, you'll complete tasks ranging from data exploration to advanced Prophet model tuning, all while writing real Python code that executes in your browser.

## Features

- **10 Day Campaign**: Progress through realistic data science workflows
- **Real Python Execution**: Write and run actual Python code using Pyodide (Python in WebAssembly)
- **Interactive Learning**: Learn pandas, matplotlib, and Prophet through hands-on tasks
- **Scoring System**: Earn points for task completion, speed, and forecast accuracy
- **4-Panel UI**: Modern interface inspired by management sims
  - Briefing Panel: Day objectives and task lists
  - Code Editor: Monaco Editor with Python syntax highlighting
  - Output Console: Real-time Python output
  - Data Preview: Interactive tables and charts

## Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **Python Runtime**: Pyodide (Python 3.11 in browser)
- **Code Editor**: Monaco Editor (VS Code engine)
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **State Management**: Zustand

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### First Launch

On first load, the game will download and initialize Pyodide (~15MB), which may take 15-30 seconds. After initialization, the game runs entirely client-side with no backend required.

## Gameplay

### The 10 Days

1. **Day 1 - First Look**: Connect to data and understand its structure
2. **Day 2 - Data Audit**: Find problems in the data
3. **Day 3 - Data Cleaning**: Fix missing values and outliers
4. **Day 4 - Feature Engineering**: Add time-based features
5. **Day 5 - Visualization**: Discover patterns visually
6. **Day 6 - Baseline Model**: Create simple moving average forecast
7. **Day 7 - Prophet Setup**: Train your first AI forecasting model
8. **Day 8 - Model Tuning**: Add seasonality and holidays
9. **Day 9 - Evaluation**: Compare Prophet vs baseline
10. **Day 10 - Delivery**: Generate final 90-day forecast

### Scoring

- **Task Points**: 10 points per task (~40 tasks total = 400 points)
- **No-Hint Bonus**: +20 points per day without using hints
- **Speed Bonus**: +10 points for completing a day under 10 minutes
- **Accuracy Bonuses**:
  - MAPE < 15%: +100 points
  - MAPE < 10%: +200 points
  - MAPE < 8%: +300 points

### Ratings

- **S**: 600+ points (Outstanding!)
- **A**: 500-599 points (Excellent!)
- **B**: 400-499 points (Good!)
- **C**: 300-399 points (Not bad!)
- **D**: Below 300 points (Keep practicing!)

## Learning Outcomes

By completing the game, you'll learn:

- ✅ Python data manipulation with pandas
- ✅ Data quality assessment and cleaning
- ✅ Feature engineering for time series
- ✅ Data visualization with matplotlib
- ✅ Forecasting with moving averages
- ✅ Facebook Prophet for time series forecasting
- ✅ Model evaluation metrics (MAPE)
- ✅ Seasonality and holiday effects in forecasting

## Browser Requirements

- Modern browser with WebAssembly support
- Minimum 1200px screen width
- ~50MB free RAM for Pyodide runtime

## Performance Notes

- **Initial Load**: 15-30 seconds (Pyodide download + initialization)
- **Subsequent Runs**: Instant (cached by browser)
- **Code Execution**: Near-native Python speed via WebAssembly

## License

MIT
