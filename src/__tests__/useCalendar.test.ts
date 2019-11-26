import { renderHook, act } from '@testing-library/react-hooks';

import { useCalendar } from '../useCalendar';
import { isSameMonth } from '../utils';
import DayOfMonthSerializer from './DayOfMonthSerializer';
import DayOfRangeMonthSerializer from './DayOfRangeMonthSerializer';

expect.addSnapshotSerializer(DayOfMonthSerializer);
expect.addSnapshotSerializer(DayOfRangeMonthSerializer);

describe('useCalendar hook tests', () => {
    test('gives correct days & month', () => {
        const date = new Date(2019, 0 /* Jan */, 1, 0, 0, 0, 0);
        const { result } = renderHook(() => useCalendar(date));

        expect(result.current.days).toMatchSnapshot();
        expect(isSameMonth(result.current.month, date)).toBe(true);
    });

    test('setMonth works', () => {
        const date1 = new Date(2019, 0 /* Jan */, 1, 0, 0, 0, 0);
        const date2 = new Date(2019, 3 /* Apr */, 1, 0, 0, 0, 0);
        const { result } = renderHook(() => useCalendar(date1));

        expect(isSameMonth(result.current.month, date1)).toBe(true);
        expect(result.current.days).toMatchSnapshot('Jan 2019');

        act(() => {
            result.current.setMonth(date2);
        });
        expect(result.current.days).toMatchSnapshot('Apr 2019');
        expect(isSameMonth(result.current.month, date2)).toBe(true);
    });
});
