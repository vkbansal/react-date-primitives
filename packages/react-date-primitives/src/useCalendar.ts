import { useState, Dispatch, SetStateAction } from 'react';

import {
  startOfMonth,
  getDaysOfMonth,
  Month,
  DayName,
  addMonths,
  setMonth,
  setYear
} from './utils';

export interface Calendar extends Month {
  readonly month: Date;
  setMonth: Dispatch<SetStateAction<Date>>;
  setStartOfWeek: Dispatch<SetStateAction<DayName>>;
  nextMonth(): void;
  prevMonth(): void;
  setMonthOnly(month: number): void;
  setYearOnly(year: number): void;
}

export function useCalendar(month = new Date(), weekStartsOn?: DayName): Calendar {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(month));
  const [startOfWeek, setStartOfWeek] = useState(weekStartsOn || DayName.SUNDAY);
  const { days, daysOfWeek } = getDaysOfMonth(currentMonth, startOfWeek);

  return {
    days,
    daysOfWeek,
    setMonth: setCurrentMonth,
    month: currentMonth,
    setStartOfWeek,
    nextMonth() {
      setCurrentMonth((month) => startOfMonth(addMonths(month, 1)));
    },
    prevMonth() {
      setCurrentMonth((month) => startOfMonth(addMonths(month, -1)));
    },
    setMonthOnly(m: number) {
      setCurrentMonth((month) => startOfMonth(setMonth(month, m)));
    },
    setYearOnly(year: number) {
      setCurrentMonth((month) => startOfMonth(setYear(month, year)));
    }
  };
}
