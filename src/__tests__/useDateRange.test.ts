import { renderHook, act } from '@testing-library/react-hooks';

import { useDateRange } from '../useDateRange';
import { isSameDay, addMonths } from '../utils';

import DateSerializer from './DateSerializer';
import DayOfRangeMonthSerializer from './DayOfRangeMonthSerializer';

expect.addSnapshotSerializer(DateSerializer);
expect.addSnapshotSerializer(DayOfRangeMonthSerializer);

describe('useDateRange hook tests', () => {
    const month = new Date(2020, 0 /* Jan */, 1, 0, 0, 0, 0);
    const months = Array.from({ length: 12 }, (_, i) => addMonths(month, i));

    test('returns basic properties', () => {
        const { result } = renderHook(() => useDateRange(months.slice(0, 3)));

        expect(result.current.startDate).toBeNull();
        expect(result.current.endDate).toBeNull();
        expect(Array.isArray(result.current.months)).toBe(true);
        expect(result.current.months.every((month) => Array.isArray(month))).toBe(true);
        expect(
            result.current.months.every((month) => month.every((week) => Array.isArray(week)))
        ).toBe(true);
        expect(result.current.months[0][0][0]).toMatchSnapshot('Single Day');
        expect(typeof result.current.setStartDate).toBe('function');
        expect(typeof result.current.setEndDate).toBe('function');
        expect(typeof result.current.setMonths).toBe('function');
    });

    test('selection works for only when endDate > startDate', () => {
        const date1 = new Date(2020, 0 /* Jan */, 1, 0, 0, 0, 0);
        const date2 = new Date(2020, 0 /* Jan */, 9, 0, 0, 0, 0);
        const { result } = renderHook(() => useDateRange(months.slice(0, 3)));

        expect(result.current.startDate).toBeNull();
        expect(result.current.endDate).toBeNull();
        expect(result.current.months).toMatchSnapshot('01. No Selection');

        // set a startDate
        act(() => {
            result.current.setStartDate(date1);
        });
        expect(isSameDay(result.current.startDate!, date1)).toBe(true);
        expect(result.current.endDate).toBeNull();

        expect(result.current.months).toMatchSnapshot('02. Start date selected');

        // set an endDate > startDate
        act(() => {
            result.current.setEndDate(date2);
        });
        expect(isSameDay(result.current.startDate!, date1)).toBe(true);
        expect(isSameDay(result.current.endDate!, date2)).toBe(true);

        expect(result.current.months).toMatchSnapshot('03. Start & End dates selected');

        // set a startDate
        act(() => {
            result.current.setStartDate(date2);
        });
        expect(isSameDay(result.current.startDate!, date2)).toBe(true);
        expect(result.current.endDate).toBeNull();

        expect(result.current.months).toMatchSnapshot('04. Start date selected again');

        // set an endDate > startDate
        act(() => {
            result.current.setEndDate(date1);
        });
        expect(isSameDay(result.current.startDate!, date2)).toBe(true);
        expect(result.current.endDate).toBeNull();

        expect(result.current.months).toMatchSnapshot('05. Try selecting smaller end date again');
    });

    test('setMonths works', () => {
        const { result } = renderHook(() => useDateRange(months.slice(0, 3)));

        expect(result.current.months).toMatchSnapshot();

        act(() => {
            result.current.setMonths(months.slice(3, 6));
        });

        expect(result.current.months).toMatchSnapshot();
    });
});
