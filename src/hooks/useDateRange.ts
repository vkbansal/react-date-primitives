import { useState } from 'react';

import { DayOfMonth, isDayBefore, isDayAfter, isSameDay } from '../utils';

export interface DayOfRangeMonth extends DayOfMonth {
    inRange: boolean;
    selected: boolean;
    isStart: boolean;
    isEnd: boolean;
}

export interface UseDateRange {
    handleDayClick(day: Date): void;
    handleDayHover(day: Date): void;
    startDate: Date;
    endDate?: Date;
    processMonth(month: DayOfMonth[][]): DayOfRangeMonth[][];
}

export function useDateRange(
    initialStartDate: Date = new Date(),
    initialEndDate?: Date
): UseDateRange {
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [selectionActive, setSelectionActive] = useState(false);

    function handleDayClick(day: Date) {
        if (startDate && selectionActive && !isDayBefore(day, startDate)) {
            setStartDate(startDate);
            setEndDate(day);
            setSelectionActive(false);
        } else {
            setStartDate(day);
            setEndDate(undefined);
            setSelectionActive(true);
        }
    }

    function handleDayHover(day: Date) {
        if (selectionActive && startDate && !isDayBefore(day, startDate)) {
            setEndDate(day);
        }
    }

    function processMonth(month: DayOfMonth[][]): DayOfRangeMonth[][] {
        return month.map<DayOfRangeMonth[]>((week) =>
            week.map<DayOfRangeMonth>((day) => {
                const isStart = startDate && isSameDay(day.date, startDate);
                const isEnd = Boolean(endDate && isSameDay(day.date, endDate));

                return {
                    ...day,
                    selected: isStart || isEnd,
                    inRange: Boolean(
                        startDate &&
                            isDayAfter(day.date, startDate) &&
                            endDate &&
                            isDayBefore(day.date, endDate)
                    ),
                    isStart,
                    isEnd
                };
            })
        );
    }

    return { handleDayClick, handleDayHover, startDate, endDate, processMonth };
}
