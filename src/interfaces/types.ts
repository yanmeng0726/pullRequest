export interface PullResponse {
  open: number;
  close: number;
}

export interface calculateDate {
  (date: string): string[];
}

export interface validateDate {
  (date: string): boolean;
}
