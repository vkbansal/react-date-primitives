export interface DayOfMonth {
    date: Date;
    inCurrentMonth: boolean;
}

export type DaysOfMonth = DayOfMonth[][];

const monthsCache: Map<string, DaysOfMonth> = new Map();

export function setDay(date: Date, day: number): Date {
    const newDate = new Date(date.getTime());

    newDate.setDate(day);

    return newDate;
}

export function addDays(date: Date, days: number): Date {
    return setDay(date, date.getDate() + days);
}

export function setMonth(date: Date, month: number): Date {
    const newDate = new Date(date.getTime());

    newDate.setMonth(month);

    return newDate;
}

export function addMonths(date: Date, months: number): Date {
    return setMonth(date, date.getMonth() + months);
}

export function setYear(date: Date, year: number): Date {
    const newDate = new Date(date.getTime());

    newDate.setFullYear(year);

    return newDate;
}

export function startOfMonth(date: Date): Date {
    const newDate = new Date(date.getTime());

    newDate.setDate(1);
    newDate.setHours(0, 0, 0, 0);

    return newDate;
}

export function endOfMonth(date: Date): Date {
    const newDate = new Date(date.getTime());

    newDate.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
    newDate.setHours(23, 59, 59, 999);

    return newDate;
}

export function isSameMonth(dateLeft: Date, dateRight: Date): boolean {
    return (
        dateLeft.getFullYear() === dateRight.getFullYear() &&
        dateLeft.getMonth() === dateRight.getMonth()
    );
}

export function isSameDay(dateLeft: Date, dateRight: Date): boolean {
    return (
        dateLeft.getFullYear() === dateRight.getFullYear() &&
        dateLeft.getMonth() === dateRight.getMonth() &&
        dateLeft.getDate() === dateRight.getDate()
    );
}

export function isDayAfter(date: Date, dateToCompare: Date): boolean {
    const newDate = new Date(date.getTime());
    const newDateToCompare = new Date(dateToCompare.getTime());

    newDate.setHours(0, 0, 0, 0);
    newDateToCompare.setHours(0, 0, 0, 0);

    return newDate.getTime() > newDateToCompare.getTime();
}

export function isDayBefore(date: Date, dateToCompare: Date): boolean {
    const newDate = new Date(date.getTime());
    const newDateToCompare = new Date(dateToCompare.getTime());

    newDate.setHours(0, 0, 0, 0);
    newDateToCompare.setHours(0, 0, 0, 0);

    return newDate.getTime() < newDateToCompare.getTime();
}

export function callIfExists(callback?: any, ...args: any[]) {
    if (typeof callback === 'function') {
        callback(...args);
    }
}

export function getDaysOfMonth(month: Date): DayOfMonth[][] {
    const firstDate = startOfMonth(month);
    const key = `${firstDate.getFullYear()}-${firstDate.getMonth()}`;

    const data = monthsCache.get(key);

    if (data) {
        return data;
    }

    const firstDayInCurrentMonth = firstDate.getDay();

    const newdata: DaysOfMonth = Array.from(
        { length: 6 },
        (_1, i): DayOfMonth[] => {
            const week = Array.from(
                { length: 7 },
                (_2, j): DayOfMonth => {
                    const day = addDays(firstDate, i * 7 + j - firstDayInCurrentMonth);

                    return { date: day, inCurrentMonth: isSameMonth(firstDate, day) };
                }
            );

            return week;
        }
    );

    monthsCache.set(key, newdata);

    return newdata;
}
