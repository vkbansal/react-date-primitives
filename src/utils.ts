export const DayOfMonthSymbol = Symbol('DayOfMonth');
export const DayOfRangeMonthSymbol = Symbol('DayOfRangeMonth');

export enum Day {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY'
}

export const WeekDays: Day[] = [
    Day.SUNDAY,
    Day.MONDAY,
    Day.TUESDAY,
    Day.WEDNESDAY,
    Day.THURSDAY,
    Day.FRIDAY,
    Day.SATURDAY
];

type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

export interface IDayOfMonth {
    readonly __type: typeof DayOfMonthSymbol;
    readonly date: Date;
    readonly dayName: Day;
    readonly inCurrentMonth: boolean;
    readonly ISODateString: string;
}

export interface IDayOfRangeMonth extends Omit<IDayOfMonth, '__type'> {
    readonly __type: typeof DayOfRangeMonthSymbol;
    readonly inRange: boolean;
    readonly isStart: boolean;
    readonly isEnd: boolean;
}

export interface IMonth {
    readonly days: IDayOfMonth[][];
    readonly daysOfWeek: Day[];
    readonly month: Date;
}

export interface IRangeMonth {
    readonly days: IDayOfRangeMonth[][];
    readonly month: Date;
}

export interface IRangeMonths {
    readonly months: IRangeMonth[];
    readonly daysOfWeek: Day[];
}

const monthsCache = new Map<string, IMonth>();
const rangeMonthsCache = new Map<string, IRangeMonths>();

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

export function getDaysOfMonth(month: Date, weekStartsOn = Day.SUNDAY): IMonth {
    const firstDate = startOfMonth(month);
    const dayOffset = WeekDays.findIndex((d) => d === weekStartsOn);
    const key = `${firstDate.getFullYear()}-${firstDate.getMonth()}-${weekStartsOn}`;

    if (dayOffset < 0) {
        throw new RangeError(`Invalid value for day provided: ${weekStartsOn}`);
    }

    const data = monthsCache.get(key);

    if (data) {
        return data;
    }

    const firstDayInCurrentMonth = firstDate.getDay();

    const days: IMonth['days'] = Array.from({ length: 6 }, (_1, weekNum): IDayOfMonth[] => {
        const week = Array.from(
            { length: 7 },
            (_2, dayInWeek): IDayOfMonth => {
                const daysElapsed = weekNum * 7;
                const day = addDays(
                    firstDate,
                    daysElapsed + dayInWeek - firstDayInCurrentMonth + dayOffset
                );

                return {
                    __type: DayOfMonthSymbol,
                    date: day,
                    dayName: WeekDays[(dayInWeek + dayOffset) % 7],
                    inCurrentMonth: isSameMonth(firstDate, day),
                    ISODateString: toISODateString(day)
                };
            }
        );

        return week;
    });

    const daysOfWeek = WeekDays.slice(dayOffset).concat(WeekDays.slice(0, dayOffset));

    monthsCache.set(key, { days, daysOfWeek, month: firstDate });

    return { days, daysOfWeek, month: firstDate };
}

export function getDaysOfRangeMonth(
    rangeMonths: Date[],
    startDate?: Date | null,
    endDate?: Date | null,
    weekStartsOn = Day.SUNDAY
): IRangeMonths {
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

    const months = rangeMonths.reduce<Mutable<IRangeMonths>>(
        (accumulator, currentMonth, i) => {
            const { days, daysOfWeek } = getDaysOfMonth(currentMonth, weekStartsOn);

            if (i === 0) {
                accumulator.daysOfWeek = daysOfWeek.slice(0);
            }

            const daysOfCurrentMonth = days.map((week): IDayOfRangeMonth[] =>
                week.map(
                    (day): IDayOfRangeMonth => {
                        const isStart = Boolean(startDate && isSameDay(day.date, startDate));
                        const isEnd = Boolean(endDate && isSameDay(day.date, endDate));

                        return {
                            ...day,
                            __type: DayOfRangeMonthSymbol,
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
                    }
                )
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

    return months as IRangeMonths;
}
