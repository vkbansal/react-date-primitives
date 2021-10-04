import { useState, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import type { Month } from './utils';
import { startOfMonth, getDaysOfMonth, DayName, addMonths, setMonth, setYear } from './utils';

export interface UseCalendarReturn extends Month {
  readonly month: Date;
  setMonth: Dispatch<SetStateAction<Date>>;
  setStartOfWeek: Dispatch<SetStateAction<DayName>>;
  nextMonth(): void;
  prevMonth(): void;
  setMonthOnly(month: number): void;
  setYearOnly(year: number): void;
}

export function useCalendar(month = new Date(), weekStartsOn?: DayName): UseCalendarReturn {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(month));
  const [startOfWeek, setStartOfWeek] = useState(weekStartsOn || DayName.SUNDAY);
  const { days, daysOfWeek } = getDaysOfMonth(currentMonth, startOfWeek);

  const nextMonth = useCallback(() => {
    setCurrentMonth((month) => startOfMonth(addMonths(month, 1)));
  }, []);

  const prevMonth = useCallback(() => {
    setCurrentMonth((month) => startOfMonth(addMonths(month, -1)));
  }, []);

  const setMonthOnly = useCallback((m: number) => {
    setCurrentMonth((month) => startOfMonth(setMonth(month, m)));
  }, []);

  const setYearOnly = useCallback((year: number) => {
    setCurrentMonth((month) => startOfMonth(setYear(month, year)));
  }, []);

  return {
    days,
    daysOfWeek,
    setMonth: setCurrentMonth,
    month: currentMonth,
    setStartOfWeek,
    nextMonth,
    prevMonth,
    setMonthOnly,
    setYearOnly
  };
}
