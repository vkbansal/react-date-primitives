import { renderHook, act } from '@testing-library/react-hooks';

import { useDateRange } from '../useDateRange';
import { isSameDay, addMonths } from '../utils';

import DateSerializer from './DateSerializer';
import MonthSerializer from './MonthSerializer';

expect.addSnapshotSerializer(DateSerializer);
expect.addSnapshotSerializer(MonthSerializer);

const YEAR = 2021;

describe('useDateRange hook tests', () => {
  const month = new Date(YEAR, 0 /* Jan */, 1, 0, 0, 0, 0);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(month, i));

  test('returns basic properties', () => {
    const { result } = renderHook(() => useDateRange(months.slice(0, 3)));

    expect(result.current.range).toEqual([null, null]);
    expect(Array.isArray(result.current.months)).toBe(true);
    expect(result.current.months.every((month) => Array.isArray(month.days))).toBe(true);
    expect(typeof result.current.setRange).toBe('function');
    expect(typeof result.current.setMonths).toBe('function');
    expect(result.current.months[0].days[0]).toMatchInlineSnapshot(`
            Object {
              "ISODateString": "2020-12-27",
              "__type": Symbol(DayOfRangeMonth),
              "dateObj": 2020-12-27,
              "dayName": "SUNDAY",
              "inCurrentMonth": false,
              "inRange": false,
              "isEnd": false,
              "isStart": false,
            }
        `);
  });

  test('setRange works when endDate > startDate', () => {
    const date1 = new Date(YEAR, 0 /* Jan */, 1, 0, 0, 0, 0);
    const date2 = new Date(YEAR, 0 /* Jan */, 9, 0, 0, 0, 0);
    const { result } = renderHook(() => useDateRange(months.slice(0, 3)));

    expect(result.current.range).toEqual([null, null]);
    expect(result.current.months[0]).toMatchSnapshot('1. init');

    // set a startDate
    act(() => {
      result.current.setRange([date1, null]);
    });
    expect(isSameDay(result.current.range[0]!, date1)).toBe(true);
    expect(result.current.range[1]).toBeNull();

    expect(result.current.months[0]).toMatchSnapshot('2. starDate is set');

    // set an endDate > startDate
    act(() => {
      result.current.setRange(() => [date1, date2]);
    });
    expect(isSameDay(result.current.range[0]!, date1)).toBe(true);
    expect(isSameDay(result.current.range[1]!, date2)).toBe(true);

    expect(result.current.months[0]).toMatchSnapshot('3. endDate is set');
  });

  test('setRange throws when endDate < startDate', () => {
    try {
      const date1 = new Date(YEAR, 0 /* Jan */, 1, 0, 0, 0, 0);
      const date2 = new Date(YEAR, 0 /* Jan */, 9, 0, 0, 0, 0);
      const { result } = renderHook(() => useDateRange(months.slice(0, 3)));

      // set a startDate
      act(() => {
        result.current.setRange([date2, null]);
      });
      expect(isSameDay(result.current.range[0]!, date2)).toBe(true);
      expect(result.current.range[1]).toBeNull();

      // set an endDate < startDate
      act(() => {
        result.current.setRange([date2, date1]);
      });

      expect(result.error).toEqual(RangeError('Range end cannot be before the range start'));
    } catch (e) {
      //
    }
  });
});
