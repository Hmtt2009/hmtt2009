import type { DayConfig } from '../store/gameStore';

export const DAYS: DayConfig[] = [
  // DAY 1: First Look
  {
    day: 1,
    title: 'First Look',
    objective: 'Connect to the data and understand its structure',
    starterCode: `import pandas as pd

# Load the sales data (simulating Redshift connection)
df = pd.read_csv('sales_data.csv')

# Your tasks:
# 1. Display the first 10 rows
# 2. Check the shape of the data (rows, columns)
# 3. Display column names and data types
`,
    tasks: [
      {
        id: 'day1_task1',
        description: 'Display first 10 rows using df.head(10)',
        completed: false,
        points: 10,
      },
      {
        id: 'day1_task2',
        description: 'Print the shape of the DataFrame',
        completed: false,
        points: 10,
      },
      {
        id: 'day1_task3',
        description: 'Show data types using df.dtypes or df.info()',
        completed: false,
        points: 10,
      },
    ],
    hints: [
      'Use df.head() to display the first few rows',
      'The shape attribute gives you (rows, columns): df.shape',
      'Code: print(df.head(10))\\nprint(df.shape)\\nprint(df.dtypes)',
    ],
  },

  // DAY 2: Data Audit
  {
    day: 2,
    title: 'Data Audit',
    objective: 'Find problems in the data that need fixing',
    starterCode: `import pandas as pd

df = pd.read_csv('sales_data.csv')
df['date'] = pd.to_datetime(df['date'])

# Your tasks:
# 1. Check for missing values in each column
# 2. Find the date range (min and max dates)
# 3. Identify any outliers in quantity (values > 3 standard deviations)
# 4. Check if any dates are missing in the sequence
`,
    tasks: [
      {
        id: 'day2_task1',
        description: 'Check missing values',
        completed: false,
        points: 10,
      },
      {
        id: 'day2_task2',
        description: 'Find date range',
        completed: false,
        points: 10,
      },
      {
        id: 'day2_task3',
        description: 'Identify outliers',
        completed: false,
        points: 10,
      },
      {
        id: 'day2_task4',
        description: 'Find missing dates',
        completed: false,
        points: 10,
      },
    ],
    hints: [
      'Use df.isnull().sum() to find missing values',
      'Use df["date"].min() and df["date"].max() for date range',
      'Calculate mean and std, then find values beyond mean ± 3*std',
    ],
  },

  // DAY 3: Data Cleaning
  {
    day: 3,
    title: 'Data Cleaning',
    objective: 'Fix the problems found in Day 2',
    starterCode: `import pandas as pd
import numpy as np

df = pd.read_csv('sales_data.csv')
df['date'] = pd.to_datetime(df['date'])

# Your tasks:
# 1. Create a complete date range and merge to fill missing dates
# 2. Fill missing quantity/value with appropriate method (interpolation)
# 3. Handle outliers (cap them or remove them)
# 4. Validate the cleaned data
`,
    tasks: [
      {
        id: 'day3_task1',
        description: 'Fill missing dates',
        completed: false,
        points: 10,
      },
      {
        id: 'day3_task2',
        description: 'Handle missing values',
        completed: false,
        points: 10,
      },
      {
        id: 'day3_task3',
        description: 'Handle outliers',
        completed: false,
        points: 10,
      },
      {
        id: 'day3_task4',
        description: 'Save cleaned data to df_clean variable',
        completed: false,
        points: 10,
      },
    ],
    hints: [
      'Create full date range with pd.date_range(), then merge',
      'Use df.interpolate() or df.fillna() for missing values',
      'Clip outliers using np.clip() or remove with boolean indexing',
    ],
  },

  // DAY 4: Feature Engineering
  {
    day: 4,
    title: 'Feature Engineering',
    objective: 'Add useful features for forecasting',
    starterCode: `import pandas as pd

df_clean = pd.read_csv('sales_data_clean.csv')
df_clean['date'] = pd.to_datetime(df_clean['date'])

# Your tasks:
# 1. Add day_of_week column (0=Monday, 6=Sunday)
# 2. Add month column
# 3. Add is_weekend column (True/False)
# 4. Add is_month_end column
# 5. (Bonus) Add Saudi holidays flag
`,
    tasks: [
      {
        id: 'day4_task1',
        description: 'Add day_of_week column',
        completed: false,
        points: 10,
      },
      {
        id: 'day4_task2',
        description: 'Add month column',
        completed: false,
        points: 10,
      },
      {
        id: 'day4_task3',
        description: 'Add is_weekend column',
        completed: false,
        points: 10,
      },
      {
        id: 'day4_task4',
        description: 'Add is_month_end column',
        completed: false,
        points: 10,
      },
    ],
    hints: [
      'Use df["date"].dt.dayofweek for day of week',
      'Use df["date"].dt.month for month',
      'Check if dayofweek is 5 or 6 for weekends',
    ],
  },

  // DAY 5: Visualization
  {
    day: 5,
    title: 'Visualization',
    objective: 'Understand patterns in the data visually',
    starterCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('sales_data_featured.csv')
df['date'] = pd.to_datetime(df['date'])

# Your tasks:
# 1. Plot the full time series (date vs quantity)
# 2. Plot average quantity by day of week (bar chart)
# 3. Plot average quantity by month (bar chart)
# 4. Write observations as comments
`,
    tasks: [
      {
        id: 'day5_task1',
        description: 'Plot time series',
        completed: false,
        points: 10,
      },
      {
        id: 'day5_task2',
        description: 'Plot weekly pattern',
        completed: false,
        points: 10,
      },
      {
        id: 'day5_task3',
        description: 'Plot monthly pattern',
        completed: false,
        points: 10,
      },
      {
        id: 'day5_task4',
        description: 'Add observations as comments',
        completed: false,
        points: 10,
      },
    ],
    hints: [
      'Use df.plot() or plt.plot(df["date"], df["quantity"])',
      'Group by day_of_week and plot: df.groupby("day_of_week")["quantity"].mean().plot(kind="bar")',
      'Look for trends, seasonality, and unusual patterns',
    ],
  },

  // DAY 6: Baseline Model
  {
    day: 6,
    title: 'Baseline Model',
    objective: 'Create a simple forecast to beat later',
    starterCode: `import pandas as pd
import numpy as np

df = pd.read_csv('sales_data_featured.csv')
df['date'] = pd.to_datetime(df['date'])

# Your tasks:
# 1. Split data: use last 90 days as test set
# 2. Create baseline forecast using simple moving average (30-day)
# 3. Calculate MAPE (Mean Absolute Percentage Error)
# 4. Store the baseline MAPE for comparison
`,
    tasks: [
      {
        id: 'day6_task1',
        description: 'Split data correctly into train and test',
        completed: false,
        points: 10,
      },
      {
        id: 'day6_task2',
        description: 'Calculate moving average forecast',
        completed: false,
        points: 10,
      },
      {
        id: 'day6_task3',
        description: 'Calculate MAPE',
        completed: false,
        points: 10,
      },
      {
        id: 'day6_task4',
        description: 'Store baseline_mape variable',
        completed: false,
        points: 10,
      },
    ],
    hints: [
      'Split: train = df[:-90], test = df[-90:]',
      'Use df["quantity"].rolling(window=30).mean() for moving average',
      'MAPE = np.mean(np.abs((actual - predicted) / actual)) * 100',
    ],
  },

  // DAY 7: Prophet Setup
  {
    day: 7,
    title: 'Prophet Setup',
    objective: 'Train your first AI forecasting model',
    starterCode: `import pandas as pd
from prophet import Prophet

df = pd.read_csv('sales_data_featured.csv')
df['date'] = pd.to_datetime(df['date'])

# Prophet requires columns named 'ds' (date) and 'y' (target)
# Your tasks:
# 1. Prepare data in Prophet format
# 2. Initialize Prophet model
# 3. Fit the model on training data
# 4. Create future dataframe for 90 days
# 5. Generate predictions
`,
    tasks: [
      {
        id: 'day7_task1',
        description: 'Prepare Prophet format with ds and y columns',
        completed: false,
        points: 10,
      },
      {
        id: 'day7_task2',
        description: 'Initialize Prophet model',
        completed: false,
        points: 10,
      },
      {
        id: 'day7_task3',
        description: 'Fit model on training data',
        completed: false,
        points: 10,
      },
      {
        id: 'day7_task4',
        description: 'Create future dataframe and generate predictions',
        completed: false,
        points: 10,
      },
    ],
    hints: [
      'Create df_prophet with columns: df_prophet = df[["date", "quantity"]].rename(columns={"date": "ds", "quantity": "y"})',
      'Initialize: model = Prophet()',
      'Fit: model.fit(df_prophet[:-90])\\nfuture = model.make_future_dataframe(periods=90)\\nforecast = model.predict(future)',
    ],
  },

  // DAY 8: Model Tuning
  {
    day: 8,
    title: 'Model Tuning',
    objective: 'Improve Prophet with seasonality and holidays',
    starterCode: `import pandas as pd
from prophet import Prophet

df_prophet = pd.read_csv('sales_prophet.csv')

# Your tasks:
# 1. Add weekly seasonality (if not auto-detected)
# 2. Add monthly seasonality
# 3. Add Saudi holidays (Eid al-Fitr, Eid al-Adha, National Day)
# 4. Adjust seasonality_mode if needed ('additive' vs 'multiplicative')
# 5. Retrain and predict
`,
    tasks: [
      {
        id: 'day8_task1',
        description: 'Configure seasonality',
        completed: false,
        points: 10,
      },
      {
        id: 'day8_task2',
        description: 'Add Saudi holidays',
        completed: false,
        points: 10,
      },
      {
        id: 'day8_task3',
        description: 'Set seasonality mode',
        completed: false,
        points: 10,
      },
      {
        id: 'day8_task4',
        description: 'Retrain model and generate predictions',
        completed: false,
        points: 10,
      },
    ],
    hints: [
      'Add seasonality: model.add_seasonality(name="monthly", period=30.5, fourier_order=5)',
      'Create holidays DataFrame with columns: holiday, ds, lower_window, upper_window',
      'Try seasonality_mode="multiplicative" if data has increasing variance',
    ],
  },

  // DAY 9: Evaluation
  {
    day: 9,
    title: 'Evaluation',
    objective: 'Compare your model against the baseline',
    starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load your predictions and actual values
# forecast = pd.read_csv('forecast.csv')
# actuals = pd.read_csv('test_actuals.csv')

# Your tasks:
# 1. Calculate MAPE for Prophet model
# 2. Compare to baseline MAPE from Day 6
# 3. Plot actual vs predicted
# 4. Identify periods where model performed poorly
# 5. Calculate improvement percentage
`,
    tasks: [
      {
        id: 'day9_task1',
        description: 'Calculate Prophet MAPE',
        completed: false,
        points: 10,
      },
      {
        id: 'day9_task2',
        description: 'Compare to baseline MAPE',
        completed: false,
        points: 10,
      },
      {
        id: 'day9_task3',
        description: 'Plot actual vs predicted',
        completed: false,
        points: 10,
      },
      {
        id: 'day9_task4',
        description: 'Analyze errors and calculate improvement',
        completed: false,
        points: 10,
      },
    ],
    hints: [
      'Extract predictions from forecast["yhat"] for test period',
      'Calculate MAPE same as Day 6: np.mean(np.abs((actual - predicted) / actual)) * 100',
      'Improvement = (baseline_mape - prophet_mape) / baseline_mape * 100',
    ],
  },

  // DAY 10: Delivery
  {
    day: 10,
    title: 'Delivery',
    objective: 'Generate and present the final 90-day forecast',
    starterCode: `import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt

# Your tasks:
# 1. Train final model on ALL data (no holdout)
# 2. Generate 90-day forecast for quantity
# 3. Generate 90-day forecast for value
# 4. Create summary statistics (total predicted, average, min, max)
# 5. Export forecast to CSV
# 6. Create final visualization
`,
    tasks: [
      {
        id: 'day10_task1',
        description: 'Train on full dataset',
        completed: false,
        points: 10,
      },
      {
        id: 'day10_task2',
        description: 'Generate 90-day quantity forecast',
        completed: false,
        points: 10,
      },
      {
        id: 'day10_task3',
        description: 'Generate 90-day value forecast',
        completed: false,
        points: 10,
      },
      {
        id: 'day10_task4',
        description: 'Create summary statistics and visualization',
        completed: false,
        points: 10,
      },
    ],
    hints: [
      'Train on full data: model.fit(df_prophet) without splitting',
      'Generate forecast: future = model.make_future_dataframe(periods=90)\\nforecast = model.predict(future)',
      'Calculate value: forecast["value_pred"] = forecast["yhat"] * 38 (average price)',
    ],
  },
];
