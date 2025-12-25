import type { PythonExecutionResult } from '../python/pyodide';

export interface ValidationResult {
  taskId: string;
  passed: boolean;
  message: string;
}

function createValidation(
  taskId: string,
  passed: boolean,
  successMsg: string,
  failMsg: string
): ValidationResult {
  return {
    taskId,
    passed,
    message: passed ? `✓ ${successMsg}` : `✗ ${failMsg}`,
  };
}

export function validateTasks(
  day: number,
  result: PythonExecutionResult
): ValidationResult[] {
  const output = result.output || '';
  const variables = result.variables || {};
  const validations: ValidationResult[] = [];

  switch (day) {
    case 1:
      validations.push(
        createValidation(
          'day1_task1',
          (output.includes('date') && output.includes('quantity')) ||
            (output.includes('0') && output.includes('1')),
          'Data preview displayed successfully',
          'Use df.head(10) to display the first 10 rows'
        ),
        createValidation(
          'day1_task2',
          /\(\s*\d+,\s*\d+\s*\)/.test(output),
          'Shape displayed correctly',
          'Use df.shape to show (rows, columns)'
        ),
        createValidation(
          'day1_task3',
          output.includes('dtype') || output.includes('int') || output.includes('object'),
          'Data types displayed',
          'Use df.dtypes or df.info() to show data types'
        )
      );
      break;

    case 2:
      validations.push(
        createValidation(
          'day2_task1',
          output.toLowerCase().includes('null') || output.toLowerCase().includes('na') || /\d+/.test(output),
          'Missing values checked',
          'Use df.isnull().sum() to check missing values'
        ),
        createValidation(
          'day2_task2',
          /20\d{2}/.test(output) && output.split(/20\d{2}/).length > 2,
          'Date range found',
          'Show min and max dates'
        ),
        createValidation(
          'day2_task3',
          output.includes('std') || output.includes('outlier') || /\d{4,}/.test(output),
          'Outliers identified',
          'Find values beyond 3 standard deviations'
        ),
        createValidation(
          'day2_task4',
          output.includes('missing') || output.includes('gap') || /\d+/.test(output),
          'Missing dates found',
          'Check for date gaps in the sequence'
        )
      );
      break;

    case 3:
      validations.push(
        createValidation(
          'day3_task1',
          output.includes('filled') || output.includes('complete') || ('df_clean' in variables),
          'Missing dates filled',
          'Create complete date range and merge'
        ),
        createValidation(
          'day3_task2',
          output.includes('0') || output.includes('interpolate') || output.includes('fill'),
          'Missing values handled',
          'Fill missing values with interpolation'
        ),
        createValidation(
          'day3_task3',
          output.includes('clip') || output.includes('cap') || output.includes('clean'),
          'Outliers handled',
          'Cap or remove outliers'
        ),
        createValidation(
          'day3_task4',
          'df_clean' in variables,
          'Cleaned data saved to df_clean',
          'Create df_clean variable with cleaned data'
        )
      );
      break;

    case 4:
      validations.push(
        createValidation(
          'day4_task1',
          'day_of_week' in variables || output.includes('day_of_week') || output.includes('dayofweek'),
          'day_of_week column added',
          'Add day_of_week column (0-6)'
        ),
        createValidation(
          'day4_task2',
          'month' in variables || output.includes('month'),
          'month column added',
          'Add month column (1-12)'
        ),
        createValidation(
          'day4_task3',
          'is_weekend' in variables || output.includes('is_weekend') || output.includes('weekend'),
          'is_weekend column added',
          'Add is_weekend boolean column'
        ),
        createValidation(
          'day4_task4',
          'is_month_end' in variables || output.includes('is_month_end') || output.includes('month_end'),
          'is_month_end column added',
          'Add is_month_end boolean column'
        )
      );
      break;

    case 5:
      validations.push(
        createValidation(
          'day5_task1',
          output.includes('plot') || output.includes('plt'),
          'Time series plotted',
          'Plot date vs quantity'
        ),
        createValidation(
          'day5_task2',
          output.includes('groupby') || output.includes('day_of_week'),
          'Weekly pattern plotted',
          'Group by day_of_week and plot'
        ),
        createValidation(
          'day5_task3',
          output.includes('month') && (output.includes('groupby') || output.includes('plot')),
          'Monthly pattern plotted',
          'Group by month and plot'
        ),
        createValidation(
          'day5_task4',
          (output.match(/#/g) || []).length >= 2,
          'Observations added',
          'Add at least 2 comments with observations'
        )
      );
      break;

    case 6:
      validations.push(
        createValidation(
          'day6_task1',
          ('train' in variables && 'test' in variables) || output.includes('90'),
          'Data split correctly',
          'Split into train and test (last 90 days)'
        ),
        createValidation(
          'day6_task2',
          output.includes('rolling') || output.includes('mean'),
          'Moving average calculated',
          'Use rolling(30).mean() for moving average'
        ),
        createValidation(
          'day6_task3',
          /\d+\.\d+/.test(output) || output.includes('MAPE') || output.includes('mape'),
          'MAPE calculated',
          'Calculate MAPE: mean(abs((actual - predicted) / actual)) * 100'
        ),
        createValidation(
          'day6_task4',
          'baseline_mape' in variables,
          'baseline_mape variable created',
          'Store MAPE in baseline_mape variable'
        )
      );
      break;

    case 7:
      validations.push(
        createValidation(
          'day7_task1',
          output.includes('ds') && output.includes('y'),
          'Data prepared in Prophet format',
          'Create DataFrame with ds and y columns'
        ),
        createValidation(
          'day7_task2',
          output.includes('Prophet') || 'model' in variables,
          'Prophet model initialized',
          'Initialize Prophet() model'
        ),
        createValidation(
          'day7_task3',
          output.includes('fit') || output.includes('Training'),
          'Model fitted',
          'Call model.fit() on training data'
        ),
        createValidation(
          'day7_task4',
          ('forecast' in variables) || output.includes('predict') || output.includes('yhat'),
          'Predictions generated',
          'Create future dataframe and predict'
        )
      );
      break;

    case 8:
      validations.push(
        createValidation(
          'day8_task1',
          output.includes('seasonality') || output.includes('add_seasonality'),
          'Seasonality configured',
          'Add weekly/monthly seasonality'
        ),
        createValidation(
          'day8_task2',
          output.includes('holiday') || output.includes('eid') || output.includes('Holiday'),
          'Holidays added',
          'Create holidays DataFrame with Saudi holidays'
        ),
        createValidation(
          'day8_task3',
          output.includes('multiplicative') || output.includes('additive') || output.includes('seasonality_mode'),
          'Seasonality mode set',
          'Set seasonality_mode parameter'
        ),
        createValidation(
          'day8_task4',
          output.includes('fit') && output.includes('predict'),
          'Model retrained',
          'Retrain model and generate new predictions'
        )
      );
      break;

    case 9:
      validations.push(
        createValidation(
          'day9_task1',
          /\d+\.\d+/.test(output) || 'prophet_mape' in variables,
          'Prophet MAPE calculated',
          'Calculate MAPE for Prophet predictions'
        ),
        createValidation(
          'day9_task2',
          output.includes('baseline') || output.includes('comparison'),
          'Comparison made',
          'Compare Prophet MAPE to baseline MAPE'
        ),
        createValidation(
          'day9_task3',
          output.includes('plot') || output.includes('plt'),
          'Comparison plotted',
          'Plot actual vs predicted values'
        ),
        createValidation(
          'day9_task4',
          output.includes('%') || output.includes('improvement') || output.includes('better'),
          'Improvement calculated',
          'Calculate improvement percentage'
        )
      );
      break;

    case 10:
      validations.push(
        createValidation(
          'day10_task1',
          output.includes('fit') || output.includes('Training'),
          'Model trained on full data',
          'Train model on complete dataset'
        ),
        createValidation(
          'day10_task2',
          output.includes('90') && (output.includes('forecast') || output.includes('predict')),
          '90-day quantity forecast generated',
          'Generate 90-day forecast for quantity'
        ),
        createValidation(
          'day10_task3',
          output.includes('value') || /\d{6,}/.test(output),
          'Value forecast generated',
          'Calculate value forecast (quantity × price)'
        ),
        createValidation(
          'day10_task4',
          (output.includes('total') || output.includes('average')) && output.includes('plot'),
          'Summary and visualization created',
          'Create summary statistics and final plot'
        )
      );
      break;
  }

  return validations;
}
