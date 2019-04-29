import { useState } from 'react';

import { startOfMonth, getDaysOfMonth, DayOfMonth } from './utils';

export { DayOfMonth };

export interface UseCalendar {
    days: DayOfMonth[][];
    setMonth(date: Date): void;
    month: Date;
}

export function useCalendar(month = new Date()): UseCalendar {
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(month));
    const days = getDaysOfMonth(currentMonth);

    return {
        days,
        setMonth(date: Date) {
            setCurrentMonth(date);
        },
        month: currentMonth
    };
}
