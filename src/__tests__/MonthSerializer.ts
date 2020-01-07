import { IMonth, DayOfMonthSymbol } from '../utils';

const serializer: jest.SnapshotSerializerPlugin = {
    print(val: IMonth): string {
        return (
            '\n| ' +
            val.daysOfWeek.map((day) => day.padStart(10, ' ')).join(' | ') +
            ' |\n| ' +
            val.days
                .map((row) => {
                    return row.map((day) => day.ISODateString).join(' | ');
                })
                .join(' |\n| ') +
            ' |'
        );
    },
    test(val: IMonth): val is IMonth {
        return (
            Array.isArray(val.days) &&
            val.days.every(
                (week) =>
                    Array.isArray(week) && week.every((day) => day.__type === DayOfMonthSymbol)
            )
        );
    }
};

export default serializer;
