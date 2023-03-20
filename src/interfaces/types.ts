export interface PullResponse {
  open: number;
  close: number;
}

export interface calculateDate {
  (date: string): DatePair;
}

export interface calculateNextMonth {
  (month: string, year: string): MonthPair;
}

export interface filterPrsByStatus {
  (prsArr: any, open: boolean, resultArr: any): void;
}

export interface validateDate {
  (date: string): boolean;
}

export interface DatePair {
  firstDay: string;
  lastDay: string;
}

export interface MonthPair {
  month: string;
  year: string;
}
