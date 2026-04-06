export interface Schedule {
  ใบรายชื่อผู้เข้าสอบ?: number | string;
  __EMPTY?: string | number;
  __EMPTY_2?: string | number;
  __EMPTY_3?: string | number;
  [key: string]: unknown;
}

export interface ScheduleResult extends Schedule {
  date: string;
  subject?: string;
  building?: string;
}