import { useState, useRef } from 'react';

import { DayOfMonth, isDayBefore, isDayAfter, isSameDay } from './utils';

export interface DayOfRangeMonth extends DayOfMonth {
    inRange: boolean;
    selected: boolean;
    isStart: boolean;
    isEnd: boolean;
}

export interface UseDateRange {
    handleDayClick(day: Date): void;
    handleDayHover(day: Date): void;
    startDate?: Date;
    endDate?: Date;
    processMonth(month: DayOfMonth[][]): DayOfRangeMonth[][];
}

export function useDateRange(initialStartDate?: Date, initialEndDate?: Date): UseDateRange {
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const selection = useRef(false);

    function handleDayClick(day: Date) {
        if (startDate && selection.current && !isDayBefore(day, startDate)) {
            setStartDate(startDate);
            setEndDate(day);
            selection.current = false;
        } else {
            setStartDate(day);
            setEndDate(undefined);
            selection.current = true;
        }
    }

    function handleDayHover(day: Date) {
        if (startDate && selection.current && !isDayBefore(day, startDate)) {
            setEndDate(day);
        }
    }

    function processMonth(month: DayOfMonth[][]): DayOfRangeMonth[][] {
        return month.map<DayOfRangeMonth[]>((week) =>
            week.map<DayOfRangeMonth>((day) => {
                const isStart = Boolean(startDate && isSameDay(day.date, startDate));
                const isEnd = Boolean(endDate && isSameDay(day.date, endDate));

                return {
                    ...day,
                    selected: isStart || isEnd,
                    inRange:
                        isStart ||
                        isEnd ||
                        Boolean(
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
