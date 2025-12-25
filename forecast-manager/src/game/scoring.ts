export interface ScoreBreakdown {
  tasksCompleted: number;
  noHintBonus: number;
  speedBonus: number;
  accuracyBonus: number;
  total: number;
}

export function calculateDayBonus(
  _day: number,
  hintsUsed: number,
  durationMinutes: number
): number {
  let bonus = 0;

  // No hints bonus: +20 points
  if (hintsUsed === 0) {
    bonus += 20;
  }

  // Speed bonus: +10 points if completed under 10 minutes
  if (durationMinutes < 10) {
    bonus += 10;
  }

  return bonus;
}

export function calculateAccuracyBonus(mape: number | null): number {
  if (mape === null) return 0;

  if (mape < 8) {
    return 300;
  } else if (mape < 10) {
    return 200;
  } else if (mape < 15) {
    return 100;
  }

  return 0;
}

export function calculateFinalScore(
  baseScore: number,
  hintsUsed: Record<number, number>,
  dayStartTimes: Record<number, number>,
  prophetMAPE: number | null
): ScoreBreakdown {
  let noHintBonus = 0;
  let speedBonus = 0;

  // Calculate bonuses for each day
  for (let day = 1; day <= 10; day++) {
    const hints = hintsUsed[day] || 0;
    const startTime = dayStartTimes[day];

    if (startTime) {
      const duration = Math.floor((Date.now() - startTime) / 1000 / 60);

      if (hints === 0) {
        noHintBonus += 20;
      }

      if (duration < 10) {
        speedBonus += 10;
      }
    }
  }

  const accuracyBonus = calculateAccuracyBonus(prophetMAPE);

  return {
    tasksCompleted: baseScore,
    noHintBonus,
    speedBonus,
    accuracyBonus,
    total: baseScore + noHintBonus + speedBonus + accuracyBonus,
  };
}

export function getRating(score: number): string {
  if (score >= 600) return 'S';
  if (score >= 500) return 'A';
  if (score >= 400) return 'B';
  if (score >= 300) return 'C';
  return 'D';
}

export function getImprovementPercentage(
  baselineMAPE: number | null,
  prophetMAPE: number | null
): number {
  if (!baselineMAPE || !prophetMAPE) return 0;
  return Math.round(((baselineMAPE - prophetMAPE) / baselineMAPE) * 100);
}
