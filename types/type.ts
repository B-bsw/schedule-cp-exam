export interface Schedule {
  ใบรายชื่อผู้เข้าสอบ: number;
  __EMPTY: string;
  __EMPTY_2: string;
  __EMPTY_3: string;
}

export interface ScheduleResult extends Schedule {
  date: string;
}