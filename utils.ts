
import { format, startOfYear, addDays, getDaysInMonth, isSameDay } from 'date-fns';

export const getDaysOfYear = (year: number) => {
  const start = startOfYear(new Date(year, 0, 1));
  const days = [];
  for (let i = 0; i < 366; i++) {
    const date = addDays(start, i);
    if (date.getFullYear() !== year) break;
    days.push(date);
  }
  return days;
};

export const getDayKey = (date: Date) => format(date, 'yyyy-MM-dd');

export const getMonthDayMatrix = (year: number) => {
  const matrix: (Date | null)[][] = Array.from({ length: 31 }, () => Array(12).fill(null));
  
  for (let m = 0; m < 12; m++) {
    const daysInMonth = getDaysInMonth(new Date(year, m));
    for (let d = 0; d < daysInMonth; d++) {
      matrix[d][m] = new Date(year, m, d + 1);
    }
  }
  return matrix;
};

export const calculateStreak = (history: Record<string, any>) => {
  const dates = Object.keys(history).sort().reverse();
  let streak = 0;
  for (const date of dates) {
    if (history[date] === 'completed' || history[date] === 'break') {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};
