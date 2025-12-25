// Generate realistic sales dataset with patterns and problems
export function generateSalesData(): string {
  const data: string[] = ['date,quantity,value'];
  const startDate = new Date('2022-01-01');
  const endDate = new Date('2024-12-31');

  // Saudi Ramadan dates (approximate)
  const ramadanPeriods = [
    { start: new Date('2022-04-02'), end: new Date('2022-05-02') },
    { start: new Date('2023-03-22'), end: new Date('2023-04-21') },
    { start: new Date('2024-03-10'), end: new Date('2024-04-09') },
  ];

  // Missing dates (5 random gaps)
  const missingDates = new Set([
    '2022-03-15',
    '2022-07-22',
    '2023-02-10',
    '2023-09-05',
    '2024-05-18',
  ]);

  // Outlier dates (3 extreme values)
  const outlierDates = new Set([
    '2022-06-14',
    '2023-08-23',
    '2024-10-07',
  ]);

  // Negative value dates (2 data entry errors)
  const negativeDates = new Set([
    '2022-11-03',
    '2024-02-28',
  ]);

  // Promotion dates (random 5% of days)
  const promotionDates = new Set<string>();
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const promotionCount = Math.floor(totalDays * 0.05);
  for (let i = 0; i < promotionCount; i++) {
    const randomDay = Math.floor(Math.random() * totalDays);
    const date = new Date(startDate);
    date.setDate(date.getDate() + randomDay);
    promotionDates.add(date.toISOString().split('T')[0]);
  }

  let currentDate = new Date(startDate);
  let dayIndex = 0;

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];

    // Skip missing dates
    if (missingDates.has(dateStr)) {
      currentDate.setDate(currentDate.getDate() + 1);
      dayIndex++;
      continue;
    }

    // Base quantity with upward trend (15% per year)
    const yearProgress = dayIndex / 365;
    const baseTrend = 1000 * (1 + yearProgress * 0.15);

    // Weekly seasonality (weekends 20% higher)
    const dayOfWeek = currentDate.getDay();
    const weekendBoost = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.2 : 1.0;

    // Monthly seasonality (end of month 15% higher)
    const dayOfMonth = currentDate.getDate();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const monthEndBoost = (dayOfMonth >= daysInMonth - 3) ? 1.15 : 1.0;

    // Yearly seasonality (Q4 higher, summer lower)
    const month = currentDate.getMonth() + 1;
    let yearlySeasonality = 1.0;
    if (month === 11 || month === 12) {
      yearlySeasonality = 1.3; // Q4 boost
    } else if (month === 7 || month === 8) {
      yearlySeasonality = 0.9; // Summer dip
    }

    // Ramadan effect (25% higher)
    let ramadanBoost = 1.0;
    for (const period of ramadanPeriods) {
      if (currentDate >= period.start && currentDate <= period.end) {
        ramadanBoost = 1.25;
        break;
      }
    }

    // Promotion effect (20-40% spike)
    const promotionBoost = promotionDates.has(dateStr) ? (1.2 + Math.random() * 0.2) : 1.0;

    // Random noise (-5% to +5%)
    const noise = 0.95 + Math.random() * 0.1;

    // Calculate quantity
    let quantity = Math.round(
      baseTrend * weekendBoost * monthEndBoost * yearlySeasonality *
      ramadanBoost * promotionBoost * noise
    );

    // Handle outliers (5x normal)
    if (outlierDates.has(dateStr)) {
      quantity *= 5;
    }

    // Handle negative values (data entry errors)
    if (negativeDates.has(dateStr)) {
      quantity = -Math.abs(quantity);
    }

    // Calculate value (quantity × average price of 38 SAR with some variance)
    const priceVariance = 0.95 + Math.random() * 0.1;
    const value = Math.round(quantity * 38 * priceVariance);

    data.push(`${dateStr},${quantity},${value}`);

    currentDate.setDate(currentDate.getDate() + 1);
    dayIndex++;
  }

  return data.join('\n');
}

// Save the dataset to public/data
export function saveSalesData() {
  const csvData = generateSalesData();
  return csvData;
}
