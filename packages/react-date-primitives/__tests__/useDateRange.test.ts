import { renderHook, act } from 'react-hooks-testing-library';
import { useDateRange } from '../useDateRange';

import { isSameDay, getDaysOfMonth } from '../utils';

describe('useDateRange hook tests', () => {
    test('selection (handleDayClick) works for endDate > startDate', () => {
        const date1 = new Date(2019, 0, 1, 0, 0, 0, 0);
        const date2 = new Date(2019, 0, 9, 0, 0, 0, 0);
        const { result } = renderHook(() => useDateRange());

        expect(result.current.startDate).not.toBeDefined();
        expect(result.current.endDate).not.toBeDefined();

        // set a startDate
        act(() => {
            result.current.handleDayClick(date1);
        });
        expect(isSameDay(result.current.startDate!, date1)).toBe(true);
        expect(result.current.endDate).not.toBeDefined();

        // set an endDate > startDate
        act(() => {
            result.current.handleDayClick(date2);
        });
        expect(isSameDay(result.current.startDate!, date1)).toBe(true);
        expect(isSameDay(result.current.endDate!, date2)).toBe(true);

        const date3 = new Date(2019, 2, 1, 0, 0, 0, 0);
        const date4 = new Date(2019, 2, 9, 0, 0, 0, 0);

        // set a startDate
        act(() => {
            result.current.handleDayClick(date3);
        });
        expect(isSameDay(result.current.startDate!, date3)).toBe(true);
        expect(result.current.endDate).not.toBeDefined();

        // set an endDate > startDate
        act(() => {
            result.current.handleDayClick(date4);
        });
        expect(isSameDay(result.current.startDate!, date3)).toBe(true);
        expect(isSameDay(result.current.endDate!, date4)).toBe(true);
    });

    test('selection (handleDayClick) resets for endDate < startDate', () => {
        const date1 = new Date(2019, 0, 9, 0, 0, 0, 0);
        const date2 = new Date(2019, 0, 1, 0, 0, 0, 0);
        const { result } = renderHook(() => useDateRange());

        expect(result.current.startDate).not.toBeDefined();
        expect(result.current.endDate).not.toBeDefined();

        // set a startDate
        act(() => {
            result.current.handleDayClick(date1);
        });
        expect(isSameDay(result.current.startDate!, date1)).toBe(true);
        expect(result.current.endDate).not.toBeDefined();

        // set an endDate < startDate
        act(() => {
            result.current.handleDayClick(date2);
        });
        expect(isSameDay(result.current.startDate!, date2)).toBe(true);
        expect(result.current.endDate).not.toBeDefined();
    });

    test('handleDayOver sets endDate temporarily', () => {
        const date = new Date(2019, 0, 15, 0, 0, 0, 0);
        const prevDate = new Date(2019, 0, 10, 0, 0, 0, 0);
        const nextDate1 = new Date(2019, 0, 20, 0, 0, 0, 0);
        const nextDate2 = new Date(2019, 0, 25, 0, 0, 0, 0);

        const { result } = renderHook(() => useDateRange());

        expect(result.current.startDate).not.toBeDefined();
        expect(result.current.endDate).not.toBeDefined();

        // set a startDate
        act(() => {
            result.current.handleDayClick(date);
        });
        expect(isSameDay(result.current.startDate!, date)).toBe(true);
        expect(result.current.endDate).not.toBeDefined();

        // hover over a date < startDate
        act(() => {
            result.current.handleDayHover(prevDate);
        });
        expect(isSameDay(result.current.startDate!, date)).toBe(true);
        expect(result.current.endDate).not.toBeDefined();

        // hover over a date > startDate
        act(() => {
            result.current.handleDayHover(nextDate1);
        });
        expect(isSameDay(result.current.startDate!, date)).toBe(true);
        expect(isSameDay(result.current.endDate!, nextDate1)).toBe(true);

        // hover over a date > startDate
        act(() => {
            result.current.handleDayHover(nextDate2);
        });
        expect(isSameDay(result.current.startDate!, date)).toBe(true);
        expect(isSameDay(result.current.endDate!, nextDate2)).toBe(true);
    });

    test('processMonth adds extra info to days', () => {
        const date1 = new Date(2019, 0, 1, 0, 0, 0, 0);
        const date2 = new Date(2019, 0, 9, 0, 0, 0, 0);
        const { result } = renderHook(() => useDateRange());
        const days = getDaysOfMonth(date1);

        // set a startDate
        act(() => {
            result.current.handleDayClick(date1);
        });

        // set an endDate > startDate
        act(() => {
            result.current.handleDayClick(date2);
        });

        const expected = result.current
            .processMonth(days)
            .map((week) => week.map((day) => ({ ...day, date: day.date.toDateString() })));

        expect(expected).toMatchSnapshot();
    });
});
