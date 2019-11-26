import { DayOfMonth, DayOfMonthSymbol } from '../utils';

const serializer: jest.SnapshotSerializerPlugin = {
    print(val: DayOfMonth[][]): string {
        return (
            '\n| ' +
            val[0].map((day) => day.dayName.padStart(10, ' ')).join(' | ') +
            ' |\n| ' +
            val
                .map((row) => {
                    return row.map((day) => day.ISODateString).join(' | ');
                })
                .join(' |\n| ') +
            ' |'
        );
    },
    test(val): boolean {
        return (
            Array.isArray(val) &&
            val.every(
                (row) => Array.isArray(row) && row.every((day) => day.__type === DayOfMonthSymbol)
            )
        );
    }
};

export default serializer;
