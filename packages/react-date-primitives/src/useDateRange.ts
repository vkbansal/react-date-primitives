import { useState, SetStateAction, Dispatch } from 'react';

import { getDaysOfRangeMonth, isSameDay, isDayAfter, DayName, RangeMonths } from './utils';

export interface UseDateRangeOptions {
  rangeStartDate?: Date;
  rangeEndDate?: Date;
  weekStartsOn?: DayName;
}

export interface DateRange extends RangeMonths {
  readonly startDate: Date | null;
  readonly endDate: Date | null;
  setMonths: Dispatch<SetStateAction<Date[]>>;
  setStartDate: Dispatch<SetStateAction<Date | null>>;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
  setStartOfWeek: Dispatch<SetStateAction<DayName>>;
}

export function useDateRange(rangeMonths: Date[], options: UseDateRangeOptions = {}): DateRange {
  const [currentMonths, setCurrentMonths] = useState<Date[]>(rangeMonths);
  const [startOfWeek, setStartOfWeek] = useState(options?.weekStartsOn || DayName.SUNDAY);
  const [startDate, setStartDate] = useState<Date | null>(options?.rangeEndDate || null);
  const [endDate, setEndDate] = useState<Date | null>(options?.rangeEndDate || null);

  const { months, daysOfWeek } = getDaysOfRangeMonth(
    currentMonths,
    startDate,
    endDate,
    startOfWeek
  );

  return {
    months,
    daysOfWeek,
    startDate,
    endDate,
    setMonths: setCurrentMonths,
    setStartDate(date: SetStateAction<Date | null>): void {
      setStartDate(date);
      setEndDate(null);
    },
    setEndDate(date: SetStateAction<Date | null>): void {
      if (
        startDate &&
        date instanceof Date &&
        (isSameDay(date, startDate) || isDayAfter(date, startDate))
      ) {
        setEndDate(date);
      } else if (typeof date === 'function') {
        setEndDate(date);
      }
    },
    setStartOfWeek
  };
}
