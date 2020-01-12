import { useState, Dispatch, SetStateAction } from 'react';

import { startOfMonth, getDaysOfMonth, IMonth, Day } from './utils';

export interface ICalendar extends IMonth {
    readonly month: Date;
    setMonth: Dispatch<SetStateAction<Date>>;
    setStartOfWeek: Dispatch<SetStateAction<Day>>;
}

export function useCalendar(
    /* istanbul ignore next */ month = new Date(),
    weekStartsOn?: Day
): ICalendar {
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(month));
    const [startOfWeek, setStartOfWeek] = useState(weekStartsOn || Day.SUNDAY);
    const { days, daysOfWeek } = getDaysOfMonth(currentMonth, startOfWeek);

    return {
        days,
        daysOfWeek,
        setMonth: setCurrentMonth,
        month: currentMonth,
        setStartOfWeek
    };
}
