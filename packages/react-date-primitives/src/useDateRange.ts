import { useState, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { getDaysOfRangeMonth, isDayBefore, DayName, RangeMonths } from './utils';

export type DateRange = [Date | null, Date | null];

export interface UseDateRangeOptions {
  range?: [Date | null, Date | null];
  rangeEndDate?: Date;
  weekStartsOn?: DayName;
}

export interface UseDateRangeReturn extends RangeMonths {
  readonly range: [Date | null, Date | null];
  setMonths: Dispatch<SetStateAction<Date[]>>;
  setRange: Dispatch<SetStateAction<[Date | null, Date | null]>>;
  setStartOfWeek: Dispatch<SetStateAction<DayName>>;
}

export function useDateRange(
  rangeMonths: Date[],
  options: UseDateRangeOptions = {}
): UseDateRangeReturn {
  const [currentMonths, setCurrentMonths] = useState<Date[]>(rangeMonths);
  const [startOfWeek, setStartOfWeek] = useState(options?.weekStartsOn || DayName.SUNDAY);
  const [range, setRange] = useState<DateRange>([
    options?.range?.[0] || null,
    options?.range?.[1] || null
  ]);

  const { months, daysOfWeek } = getDaysOfRangeMonth(
    currentMonths,
    range[0],
    range[1],
    startOfWeek
  );

  const setRangeCallBack = useCallback(
    (newRange: SetStateAction<DateRange>) => {
      setRange((oldRange) => {
        const [start, end] = typeof newRange === 'function' ? newRange(oldRange) : newRange;
        if (start && end && isDayBefore(end, start)) {
          throw new RangeError(`Range end cannot be before the range start`);
        }

        return [start, end];
      });
    },
    [setRange]
  );

  return {
    months,
    daysOfWeek,
    range,
    setMonths: setCurrentMonths,
    setRange: setRangeCallBack,
    setStartOfWeek
  };
}
