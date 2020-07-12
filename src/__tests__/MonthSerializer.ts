import { Month, DayOfMonthSymbol } from '../utils';

const serializer: jest.SnapshotSerializerPlugin = {
    print(val: unknown): string {
        return (
            '\n| ' +
            (val as Month).daysOfWeek.map((day) => day.padStart(10, ' ')).join(' | ') +
            ' |\n| ' +
            (val as Month).days
                .map((row) => {
                    return row.map((day) => day.ISODateString).join(' | ');
                })
                .join(' |\n| ') +
            ' |'
        );
    },
    test(val: unknown): val is Month {
        return (
            Array.isArray((val as Month).days) &&
            (val as Month).days.every(
                (week) =>
                    Array.isArray(week) && week.every((day) => day.__type === DayOfMonthSymbol)
            )
        );
    }
};

export default serializer;
