export const DayOfMonthSymbol = Symbol('DayOfMonth');
export const DayOfRangeMonthSymbol = Symbol('DayOfRangeMonth');

export enum DayName {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY'
}

export const DaysOfTheWeek: DayName[] = [
    DayName.SUNDAY,
    DayName.MONDAY,
    DayName.TUESDAY,
    DayName.WEDNESDAY,
    DayName.THURSDAY,
    DayName.FRIDAY,
    DayName.SATURDAY
];

type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

export interface DayOfMonth {
    readonly __type: typeof DayOfMonthSymbol;
    readonly dateObj: Date;
    readonly dayName: DayName;
    readonly inCurrentMonth: boolean;
    readonly ISODateString: string;
}

export interface DayOfRangeMonth extends Omit<DayOfMonth, '__type'> {
    readonly __type: typeof DayOfRangeMonthSymbol;
    readonly inRange: boolean;
    readonly isStart: boolean;
    readonly isEnd: boolean;
}

export interface Month {
    readonly days: DayOfMonth[];
    readonly daysOfWeek: DayName[];
    readonly month: Date;
}

export interface RangeMonth {
    readonly days: DayOfRangeMonth[];
    readonly month: Date;
}

export interface RangeMonths {
    readonly months: RangeMonth[];
    readonly daysOfWeek: DayName[];
}

const monthsCache = new Map<string, Month>();
const rangeMonthsCache = new Map<string, RangeMonths>();

export function addDays(date: Date, days: number): Date {
    return setDay(date, date.getDate() + days);
}

export function addMonths(date: Date, months: number): Date {
    return setMonth(date, date.getMonth() + months);
}

export function setDay(date: Date, day: number): Date {
    const newDate = new Date(date.getTime());

    newDate.setDate(day);

    return newDate;
}

export function setMonth(date: Date, month: number): Date {
    const newDate = new Date(date.getTime());

    newDate.setMonth(month);

    return newDate;
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

export function toISODateString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = (date.getDate() + 0).toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function callIfExists<T extends unknown[], U = unknown>(
    func: ((...args: T) => U) | undefined | null,
    ...args: T
): U | undefined {
    if (typeof func === 'function') {
        return func(...args);
    }
}

export function getDaysOfMonth(month: Date, weekStartsOn = DayName.SUNDAY): Month {
    const firstDate = startOfMonth(month);
    const dayOffset = DaysOfTheWeek.findIndex((d) => d === weekStartsOn);
    const key = `${toISODateString(firstDate)}-${weekStartsOn}`;

    if (dayOffset < 0) {
        throw new RangeError(`Invalid value for day provided: ${weekStartsOn}`);
    }

    const data = monthsCache.get(key);

    if (data) {
        return data;
    }

    const firstDayInCurrentMonth = firstDate.getDay();

    const days: Month['days'] = Array.from(
        { length: 6 * 7 },
        (_1, i): DayOfMonth => {
            const day = addDays(
                firstDate,
                i -
                    firstDayInCurrentMonth -
                    (dayOffset > firstDayInCurrentMonth ? 7 : 0) +
                    dayOffset
            );

            return {
                __type: DayOfMonthSymbol,
                dateObj: day,
                dayName: DaysOfTheWeek[(i + dayOffset) % 7],
                inCurrentMonth: isSameMonth(firstDate, day),
                ISODateString: toISODateString(day)
            };
        }
    );

    const daysOfWeek = DaysOfTheWeek.slice(dayOffset).concat(DaysOfTheWeek.slice(0, dayOffset));

    monthsCache.set(key, { days, daysOfWeek, month: firstDate });

    return { days, daysOfWeek, month: firstDate };
}

export function getDaysOfRangeMonth(
    rangeMonths: Date[],
    startDate?: Date | null,
    endDate?: Date | null,
    weekStartsOn = DayName.SUNDAY
): RangeMonths {
    let key = rangeMonths
        .map((month): string => {
            if (!(month instanceof Date)) {
                throw new TypeError('Given month is not an instance of Date');
            }
            return `${month.getFullYear()}-${month.getMonth()}`;
        })
        .join('|');

    key += `|${startDate ? toISODateString(startDate) : ''}`;
    key += `|${endDate ? toISODateString(endDate) : ''}`;
    key += `|${weekStartsOn}`;

    if (rangeMonthsCache.has(key)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return rangeMonthsCache.get(key)!;
    }

    const months = rangeMonths.reduce<Mutable<RangeMonths>>(
        (accumulator, currentMonth, i) => {
            const { days, daysOfWeek } = getDaysOfMonth(currentMonth, weekStartsOn);

            if (i === 0) {
                accumulator.daysOfWeek = daysOfWeek.slice(0);
            }

            const daysOfCurrentMonth = days.map(
                (day): DayOfRangeMonth => {
                    const isStart = Boolean(startDate && isSameDay(day.dateObj, startDate));
                    const isEnd = Boolean(endDate && isSameDay(day.dateObj, endDate));

                    return {
                        ...day,
                        __type: DayOfRangeMonthSymbol,
                        inRange:
                            isStart ||
                            isEnd ||
                            Boolean(
                                startDate &&
                                    isDayAfter(day.dateObj, startDate) &&
                                    endDate &&
                                    isDayBefore(day.dateObj, endDate)
                            ),
                        isStart,
                        isEnd
                    };
                }
            );

            accumulator.months.push({
                days: daysOfCurrentMonth,
                month: startOfMonth(currentMonth)
            });

            return accumulator;
        },
        { months: [], daysOfWeek: [] }
    );

    rangeMonthsCache.set(key, months);

    return months as RangeMonths;
}
