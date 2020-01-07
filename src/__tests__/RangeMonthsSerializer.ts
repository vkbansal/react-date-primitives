import { IRangeMonths, DayOfRangeMonthSymbol } from '../utils';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const serializer: jest.SnapshotSerializerPlugin = {
    print(val: IRangeMonths): string {
        const dayNames = Array.from({ length: 6 }, () =>
            val.daysOfWeek.map((day) => day.slice(0, 1).padStart(3, ' ')).join(' | ')
        ).join(' | ');

        const days = val.months
            .map((month) => {
                const days = month.days
                    .map(
                        (week) =>
                            week
                                .map((day) => {
                                    if (day.inCurrentMonth) {
                                        let str = day.date
                                            .getDate()
                                            .toString()
                                            .padStart(2, '0');

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
    test(val: IRangeMonths): val is IRangeMonths {
        return (
            Array.isArray(val.months) &&
            val.months.every(
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
