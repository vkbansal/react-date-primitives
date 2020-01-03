import { useState } from 'react';

import {
    DayOfRangeMonth,
    getDaysOfRangeMonth,
    isSameDay,
    isDayAfter,
    DayOfWeek,
    RangeMonths
} from './utils';

export { DayOfRangeMonth };

export interface UseDateRangeOptions {
    rangeStartDate?: Date;
    rangeEndDate?: Date;
    weekStartsOn?: DayOfWeek;
}

export interface DateRange extends RangeMonths {
    readonly startDate: Date | null;
    readonly endDate: Date | null;
    setMonths(months: Date[]): void;
    setStartDate(date: Date): void;
    setEndDate(date: Date): void;
}

export function useDateRange(rangeMonths: Date[], options: UseDateRangeOptions = {}): DateRange {
    const [currentMonths, setCurrentMonths] = useState<Date[]>(rangeMonths);
    const [startDate, setStartDate] = useState<Date | null>(options.rangeEndDate || null);
    const [endDate, setEndDate] = useState<Date | null>(options.rangeEndDate || null);

    const { months, daysOfWeek } = getDaysOfRangeMonth(currentMonths, startDate, endDate);

    return {
        months,
        daysOfWeek,
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
