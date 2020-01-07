import { useState, Dispatch, SetStateAction } from 'react';

import { startOfMonth, getDaysOfMonth, DaysOfMonth, DayOfWeek } from './utils';

export interface Calendar extends DaysOfMonth {
    readonly month: Date;
    setMonth: Dispatch<SetStateAction<Date>>;
}

export function useCalendar(
    /* istanbul ignore next */ month = new Date(),
    weekStartsOn?: DayOfWeek
): Calendar {
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(month));
    const { days, daysOfWeek } = getDaysOfMonth(currentMonth, weekStartsOn);

    return {
        days,
        daysOfWeek,
        setMonth: setCurrentMonth,
        month: currentMonth
    };
}
