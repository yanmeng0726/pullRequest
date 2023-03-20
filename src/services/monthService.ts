import {
  calculateDate,
  calculateNextMonth,
  MonthPair,
  DatePair,
  filterPrsByStatus
} from '../interfaces/types';

/**
 * @param {string}date
 * @summary get first date and last date of certain month
 * @return return 1st date of month and last date of month
 */
function calculateDateFunc(date: string): DatePair {
  let [currentYear, currentMonth] = date.split('-');
  const startDate: string = currentYear + '-' + currentMonth + '-01';
  const nextDate = calculateNextMonthFunc(currentMonth, currentYear);
  const nextMonth = nextDate.month;
  const nextYear = nextDate.year;
  let lastDay: Date = new Date(nextYear + '-' + nextMonth);
  lastDay.setDate(lastDay.getDate() - 1);

  return { firstDay: startDate, lastDay: lastDay.toISOString().split('T', 1)[0] };
}

/**
 * @param {string}month
 * @param {string}year
 * @summary get next month of  certain month
 * @return 1st date of month and last date of month as pair
 */
function calculateNextMonthFunc(month: string, year: string): MonthPair {
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

/**
 * @param prsArr
 * @param {boolean}open
 * @param resultObj
 * @summary filter data by status and save in result array
 * @return void
 */
function filterPrsByStatusFunc(prsArr: any, open: boolean, resultObj: any): void {
  prsArr.data.items.forEach((pr: any) => {
    if (open) {
      const createdDate = pr.created_at.split('T')[0];
      const [createdYear, createdMonth] = createdDate.split('-');
      const createdCurrentMonth = createdYear + '-' + createdMonth;
      resultObj[createdCurrentMonth].open = resultObj[createdCurrentMonth].open + 1;
    } else {
      const closedDate = pr.closed_at.split('T')[0];
      const [closedYear, closedMonth] = closedDate.split('-');
      const closedCurrentMonth = closedYear + '-' + closedMonth;
      resultObj[closedCurrentMonth].close = resultObj[closedCurrentMonth].close + 1;
    }
  });
}



/**
 * @param {string}currentMonth
 * @param {string}endMonthEndDate
 * @param resultObj
 * @summary init result array, add all time fields in to resultObj
 * @return void
 */
function initializeResultArrFunc(
  currentMonth: string,
  endMonthEndDate: string,
  resultObj: any
): void {
  while (new Date(currentMonth) <= new Date(endMonthEndDate)) {
    let [year, month] = currentMonth.split('-');
    resultObj[currentMonth] = { open: 0, close: 0 };
    const nextDate = calculateNextMonth(month, year);
    const nextYear = nextDate.year;
    const nextMonth = nextDate.month;
    currentMonth = nextYear + '-' + nextMonth;
  }
}

const getFirstAndLastDayOfMonth: calculateDate = calculateDateFunc;
const calculateNextMonth: calculateNextMonth = calculateNextMonthFunc;
const filterPrsByStatus: filterPrsByStatus = filterPrsByStatusFunc;
const initializeResultArr = initializeResultArrFunc;
export { getFirstAndLastDayOfMonth, calculateNextMonth, filterPrsByStatus, initializeResultArr };
