import { useState } from 'react';

import { startOfMonth, getDaysOfMonth, DaysOfMonth, DayOfWeek } from './utils';

export interface Calendar extends DaysOfMonth {
    readonly month: Date;
    setMonth(date: Date): void;
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
        setMonth(date: Date): void {
            setCurrentMonth(date);
        },
        month: currentMonth
    };
}
