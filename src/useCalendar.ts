import { useState, Dispatch, SetStateAction } from 'react';

import { startOfMonth, getDaysOfMonth, Month, Day, addMonths, setMonth, setYear } from './utils';

export interface Calendar extends Month {
    readonly month: Date;
    setMonth: Dispatch<SetStateAction<Date>>;
    setStartOfWeek: Dispatch<SetStateAction<Day>>;
    nextMonth(): void;
    prevMonth(): void;
    setMonthOnly(month: number): void;
    setYearOnly(year: number): void;
}

export function useCalendar(
    /* istanbul ignore next */ month = new Date(),
    weekStartsOn?: Day
): Calendar {
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(month));
    const [startOfWeek, setStartOfWeek] = useState(weekStartsOn || Day.SUNDAY);
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
