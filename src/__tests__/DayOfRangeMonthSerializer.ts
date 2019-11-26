import { DayOfRangeMonth, DayOfRangeMonthSymbol } from '../utils';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const serializer: jest.SnapshotSerializerPlugin = {
    print(val: DayOfRangeMonth[][][]): string {
        const dayNames = val[0]
            .map((week) => week.map((day) => day.dayName.slice(0, 1).padStart(3, ' ')).join(' | '))
            .join(' | ');
        const days = val
            .map((month) => {
                const firstDay =
                    month[0].find((day) => day.date.getUTCDate() === 1) ||
                    month[1].find((day) => day.date.getUTCDate() === 1);

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const monthName = months[firstDay!.date.getMonth()];

                const days = month
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

                return `${monthName} => ${days}`;
            })
            .join('\n');

        return `${' '.repeat(7)}${dayNames}\n${days}`;
    },
    test(val): boolean {
        return (
            Array.isArray(val) &&
            val.every(
                (month) =>
                    Array.isArray(month) &&
                    month.every(
                        (week) =>
                            Array.isArray(week) &&
                            week.every((day) => day.__type === DayOfRangeMonthSymbol)
                    )
            )
        );
    }
};

export default serializer;
