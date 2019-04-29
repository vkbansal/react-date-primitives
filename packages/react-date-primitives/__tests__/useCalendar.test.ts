import { renderHook, act } from 'react-hooks-testing-library';
import { useCalendar } from '../useCalendar';

import { isSameMonth } from '../utils';

describe('useCalendar hook tests', () => {
    test('gives correct days & month', () => {
        const date = new Date(2019, 0, 1, 0, 0, 0, 0);
        const { result } = renderHook(() => useCalendar(date));
        const days = result.current.days.map((week) =>
            week.map((day) => ({ ...day, date: day.date.toDateString() }))
        );

        expect(days).toMatchSnapshot();
        expect(isSameMonth(result.current.month, date)).toBe(true);
    });

    test('setMonth works', () => {
        const date1 = new Date(2019, 0, 1, 0, 0, 0, 0);
        const date2 = new Date(2019, 3, 1, 0, 0, 0, 0);
        const { result } = renderHook(() => useCalendar(date1));

        expect(isSameMonth(result.current.month, date1)).toBe(true);

        act(() => {
            result.current.setMonth(date2);
        });
        expect(isSameMonth(result.current.month, date2)).toBe(true);
    });
});
