import { calculateDate, DatePair } from '../interfaces/types';

function calculateDateFunc(date: string): string[] {
  let [currentYear, currentMonth] = date.split('-');
  const startDate: string = currentYear + '-' + currentMonth + '-01';
  const nextDate = calculateNextMonthFunc(currentMonth, currentYear);
  const nextMonth = nextDate.month;
  const nextYear = nextDate.year;
  let lastDay: Date = new Date(nextYear + '-' + nextMonth);
  lastDay.setDate(lastDay.getDate() - 1);

  return [startDate, lastDay.toISOString().split('T', 1)[0]];
}

function calculateNextMonthFunc(month: string, year: string): DatePair {
  if (month !== '12') {
    month = (Number(month) + 1).toString();
    if (month.length != 2) {
      month = '0' + month;
    }
  } else {
    year = (Number(year) + 1).toString();
    month = '01';
  }
  return { month: month, year: year };
}

const calculateLastDayOfMonth: calculateDate = calculateDateFunc;
const calculateNextMonth = calculateNextMonthFunc;
export { calculateLastDayOfMonth, calculateNextMonth };
