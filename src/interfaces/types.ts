export interface PullResponse {
  open: number;
  close: number;
}

export interface PullResponseArrayObj {
  month: string;
  open: number;
  close: number;
}
export interface calculateDate {
  (date: string): string[];
}

export interface validateDate {
  (date: string): boolean;
}

export interface DatePair {
  month: string;
  year: string;
}
