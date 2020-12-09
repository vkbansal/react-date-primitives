import { renderHook, act } from '@testing-library/react-hooks';

import { useDateRange } from '../useDateRange';
import { isSameDay, addMonths, Day } from '../utils';

import DateSerializer from './DateSerializer';
import RangeMonthsSerializer from './RangeMonthsSerializer';

expect.addSnapshotSerializer(DateSerializer);
expect.addSnapshotSerializer(RangeMonthsSerializer);

describe('useDateRange hook tests', () => {
    const month = new Date(2020, 0 /* Jan */, 1, 0, 0, 0, 0);
    const months = Array.from({ length: 12 }, (_, i) => addMonths(month, i));

    test('returns basic properties', () => {
        const { result } = renderHook(() => useDateRange(months.slice(0, 3)));

        expect(result.current.startDate).toBeNull();
        expect(result.current.endDate).toBeNull();
        expect(Array.isArray(result.current.months)).toBe(true);
        expect(result.current.months.every((month) => Array.isArray(month.days))).toBe(true);
        expect(
            result.current.months.every((month) => month.days.every((week) => Array.isArray(week)))
        ).toBe(true);
        expect(result.current.months[0].days[0][0]).toMatchSnapshot('Single Day');
        expect(typeof result.current.setStartDate).toBe('function');
        expect(typeof result.current.setEndDate).toBe('function');
        expect(typeof result.current.setMonths).toBe('function');
    });

    describe('setEndDate', () => {
        describe('`Date` value', () => {
            test('works for only when endDate > startDate', () => {
                const date1 = new Date(2020, 0 /* Jan */, 1, 0, 0, 0, 0);
                const date2 = new Date(2020, 0 /* Jan */, 9, 0, 0, 0, 0);
                const { result } = renderHook(() => useDateRange(months.slice(0, 3)));

                expect(result.current.startDate).toBeNull();
                expect(result.current.endDate).toBeNull();
                expect(result.current).toMatchSnapshot('01. No Selection');

                // set a startDate
                act(() => {
                    result.current.setStartDate(date1);
                });
                expect(isSameDay(result.current.startDate!, date1)).toBe(true);
                expect(result.current.endDate).toBeNull();

                expect(result.current).toMatchSnapshot('02. Start date selected');

                // set an endDate > startDate
                act(() => {
                    result.current.setEndDate(date2);
                });
                expect(isSameDay(result.current.startDate!, date1)).toBe(true);
                expect(isSameDay(result.current.endDate!, date2)).toBe(true);

                expect(result.current).toMatchSnapshot('03. Start & End dates selected');

                // set a startDate
                act(() => {
                    result.current.setStartDate(date2);
                });
                expect(isSameDay(result.current.startDate!, date2)).toBe(true);
                expect(result.current.endDate).toBeNull();

                expect(result.current).toMatchSnapshot('04. Start date selected again');

                // set an endDate < startDate
                act(() => {
                    result.current.setEndDate(date1);
                });
                expect(isSameDay(result.current.startDate!, date2)).toBe(true);
                expect(result.current.endDate).toBeNull();

                expect(result.current).toMatchSnapshot('05. Try selecting smaller end date again');
            });
        });

        describe('functional value', () => {
            test('works without any checks', () => {
                const date1 = new Date(2020, 0 /* Jan */, 1, 0, 0, 0, 0);
                const date2 = new Date(2020, 0 /* Jan */, 5, 0, 0, 0, 0);
                const date3 = new Date(2020, 0 /* Jan */, 9, 0, 0, 0, 0);
                const { result } = renderHook(() => useDateRange(months.slice(0, 3)));

                expect(result.current.startDate).toBeNull();
                expect(result.current.endDate).toBeNull();
                expect(result.current).toMatchSnapshot('01. No Selection');

                // set a startDate
                act(() => {
                    result.current.setStartDate(() => date1);
                });
                expect(isSameDay(result.current.startDate!, date1)).toBe(true);
                expect(result.current.endDate).toBeNull();

                expect(result.current).toMatchSnapshot('02. Start date selected');

                act(() => {
                    result.current.setEndDate(() => date3);
                });
                expect(isSameDay(result.current.startDate!, date1)).toBe(true);
                expect(isSameDay(result.current.endDate!, date3)).toBe(true);

                expect(result.current).toMatchSnapshot('03. Start & End dates selected');

                // set a endDate
                act(() => {
                    result.current.setEndDate(() => date2);
                });
                expect(isSameDay(result.current.endDate!, date2)).toBe(true);

                expect(result.current).toMatchSnapshot('04. End date selected again');

                // set an endDate > startDate
                act(() => {
                    result.current.setStartDate(() => date3);
                    result.current.setEndDate(() => date1);
                });
                expect(isSameDay(result.current.startDate!, date3)).toBe(true);
                expect(isSameDay(result.current.endDate!, date1)).toBe(true);

                expect(result.current).toMatchSnapshot('05. Try selecting smaller end date');
            });
        });
    });

    test('setMonths works', () => {
        const { result } = renderHook(() => useDateRange(months.slice(0, 3)));

        expect(result.current).toMatchSnapshot();

        act(() => {
            result.current.setMonths(months.slice(3, 6));
        });

        expect(result.current).toMatchSnapshot();
    });

    test('changing `weekStartsOn` works', () => {
        const { result } = renderHook(() => useDateRange(months.slice(0, 3)));
        expect(result.current.daysOfWeek[0]).toBe(Day.SUNDAY);
        expect(result.current).toMatchSnapshot(Day.SUNDAY);

        act(() => {
            result.current.setStartOfWeek(Day.MONDAY);
        });

        expect(result.current.daysOfWeek[0]).toBe(Day.MONDAY);
        expect(result.current).toMatchSnapshot(Day.MONDAY);
    });
});
