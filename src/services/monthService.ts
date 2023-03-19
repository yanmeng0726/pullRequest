import { calculateDate } from '../interfaces/types';

function calculateDateFunc(date: string): string[] {
  let [year, month] = date.split('-');
  const startDate: string = year + '-' + month + '-01';

  // get first day of next month, then minus 1 day to get the last day of the month
  let nextMonth: string;
  if (month === '12') {
    year = (Number(year) + 1).toString();
    nextMonth = '1';
  } else {
    nextMonth = (Number(month) + 1).toString();
  }
  let lastDay: Date = new Date(year + '-' + nextMonth);
  lastDay.setDate(lastDay.getDate() - 1);

  return [startDate, lastDay.toISOString().split('T', 1)[0]];
}

const calculateLastDayOfMonth: calculateDate = calculateDateFunc;
export default calculateLastDayOfMonth;
