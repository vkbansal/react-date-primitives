import { RangeMonths, DayOfRangeMonthSymbol } from '../utils';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const serializer: jest.SnapshotSerializerPlugin = {
    print(val: unknown): string {
        const dayNames = Array.from({ length: 6 }, () =>
            (val as RangeMonths).daysOfWeek
                .map((day) => day.slice(0, 1).padStart(3, ' '))
                .join(' | ')
        ).join(' | ');

        const days = (val as RangeMonths).months
            .map((month) => {
                const days = month.days
                    .map(
                        (week) =>
                            week
                                .map((day) => {
                                    if (day.inCurrentMonth) {
                                        let str = day.date.getDate().toString().padStart(2, '0');

                                        str = (day.inRange ? '*' : ' ') + str;

                                        return str;
                                    }

                                    return ' '.repeat(3);
                                })
                                .join(' | '),
                        ''
                    )
                    .join(' | ');

                return `${months[month.month.getMonth()]} => ${days}`;
            })
            .join('\n');

        return `${' '.repeat(7)}${dayNames}\n${days}`;
    },
    test(val: unknown): val is RangeMonths {
        return (
            Array.isArray((val as RangeMonths).months) &&
            (val as RangeMonths).months.every(
                (month) =>
                    Array.isArray(month.days) &&
                    month.days.every(
                        (week) =>
                            Array.isArray(week) &&
                            week.every((day) => day.__type === DayOfRangeMonthSymbol)
                    )
            )
        );
    }
};

export default serializer;
