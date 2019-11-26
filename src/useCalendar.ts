import { useState } from 'react';

import { startOfMonth, getDaysOfMonth, DayOfMonth, DayOfWeek } from './utils';

export { DayOfMonth };

export interface Calendar {
    readonly days: DayOfMonth[][];
    readonly month: Date;
    setMonth(date: Date): void;
}

export function useCalendar(
    /* istanbul ignore next */ month = new Date(),
    weekStartsOn?: DayOfWeek
): Calendar {
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(month));
    const days = getDaysOfMonth(currentMonth, weekStartsOn);

    return {
        days,
        setMonth(date: Date): void {
            setCurrentMonth(date);
        },
        month: currentMonth
    };
}
