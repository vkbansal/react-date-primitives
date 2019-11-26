import { useState } from 'react';

import { DayOfRangeMonth, getDaysOfRangeMonth, isSameDay, isDayAfter, DayOfWeek } from './utils';

export { DayOfRangeMonth };

export interface UseDateRangeOptions {
    rangeStartDate?: Date;
    rangeEndDate?: Date;
    weekStartsOn?: DayOfWeek;
}

export interface DateRange {
    readonly months: DayOfRangeMonth[][][];
    readonly startDate: Date | null;
    readonly endDate: Date | null;
    setMonths(months: Date[]): void;
    setStartDate(date: Date): void;
    setEndDate(date: Date): void;
}

export function useDateRange(months: Date[], options: UseDateRangeOptions = {}): DateRange {
    const [currentMonths, setCurrentMonths] = useState<Date[]>(months);
    const [startDate, setStartDate] = useState<Date | null>(options.rangeEndDate || null);
    const [endDate, setEndDate] = useState<Date | null>(options.rangeEndDate || null);

    const rangeMonths = getDaysOfRangeMonth(currentMonths, startDate, endDate);

    return {
        months: rangeMonths,
        startDate,
        endDate,
        setMonths(months: Date[]): void {
            setCurrentMonths(months);
        },
        setStartDate(date: Date): void {
            setStartDate(date);
            setEndDate(null);
        },
        setEndDate(date: Date): void {
            if (startDate && (isSameDay(date, startDate) || isDayAfter(date, startDate))) {
                setEndDate(date);
            }
        }
    };
}
