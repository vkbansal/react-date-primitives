import { renderHook, act } from '@testing-library/react-hooks';

import { useDateRange } from '../useDateRange';
import { isSameDay, addMonths, DayName } from '../utils';

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

    expect(result.current.startDate).toBeNull();
    expect(result.current.endDate).toBeNull();
    expect(Array.isArray(result.current.months)).toBe(true);
    expect(result.current.months.every((month) => Array.isArray(month.days))).toBe(true);
    expect(typeof result.current.setStartDate).toBe('function');
    expect(typeof result.current.setEndDate).toBe('function');
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

  describe('setEndDate', () => {
    describe('`Date` value', () => {
      test('works for only when endDate > startDate', () => {
        const date1 = new Date(YEAR, 0 /* Jan */, 1, 0, 0, 0, 0);
        const date2 = new Date(YEAR, 0 /* Jan */, 9, 0, 0, 0, 0);
        const { result } = renderHook(() => useDateRange(months.slice(0, 3)));

        expect(result.current.startDate).toBeNull();
        expect(result.current.endDate).toBeNull();
        expect(result.current.months[0]).toMatchInlineSnapshot(`
  |                Jan 2021                 |
  |-----------------------------------------|
  |
  |     |     |     |     |     |  01 |  02 |
  |  03 |  04 |  05 |  06 |  07 |  08 |  09 |
  |  10 |  11 |  12 |  13 |  14 |  15 |  16 |
  |  17 |  18 |  19 |  20 |  21 |  22 |  23 |
  |  24 |  25 |  26 |  27 |  28 |  29 |  30 |
  |  31 |     |     |     |     |     |     |
`);

        // set a startDate
        act(() => {
          result.current.setStartDate(date1);
        });
        expect(isSameDay(result.current.startDate!, date1)).toBe(true);
        expect(result.current.endDate).toBeNull();

        expect(result.current.months[0]).toMatchInlineSnapshot(`
  |                Jan 2021                 |
  |-----------------------------------------|
  |
  |     |     |     |     |     |  ** |  02 |
  |  03 |  04 |  05 |  06 |  07 |  08 |  09 |
  |  10 |  11 |  12 |  13 |  14 |  15 |  16 |
  |  17 |  18 |  19 |  20 |  21 |  22 |  23 |
  |  24 |  25 |  26 |  27 |  28 |  29 |  30 |
  |  31 |     |     |     |     |     |     |
`);

        // set an endDate > startDate
        act(() => {
          result.current.setEndDate(date2);
        });
        expect(isSameDay(result.current.startDate!, date1)).toBe(true);
        expect(isSameDay(result.current.endDate!, date2)).toBe(true);

        expect(result.current.months[0]).toMatchInlineSnapshot(`
  |                Jan 2021                 |
  |-----------------------------------------|
  |
  |     |     |     |     |     |  ** |  ** |
  |  ** |  ** |  ** |  ** |  ** |  ** |  ** |
  |  10 |  11 |  12 |  13 |  14 |  15 |  16 |
  |  17 |  18 |  19 |  20 |  21 |  22 |  23 |
  |  24 |  25 |  26 |  27 |  28 |  29 |  30 |
  |  31 |     |     |     |     |     |     |
`);

        // set a startDate
        act(() => {
          result.current.setStartDate(date2);
        });
        expect(isSameDay(result.current.startDate!, date2)).toBe(true);
        expect(result.current.endDate).toBeNull();

        expect(result.current.months[0]).toMatchInlineSnapshot(`
  |                Jan 2021                 |
  |-----------------------------------------|
  |
  |     |     |     |     |     |  01 |  02 |
  |  03 |  04 |  05 |  06 |  07 |  08 |  ** |
  |  10 |  11 |  12 |  13 |  14 |  15 |  16 |
  |  17 |  18 |  19 |  20 |  21 |  22 |  23 |
  |  24 |  25 |  26 |  27 |  28 |  29 |  30 |
  |  31 |     |     |     |     |     |     |
`);

        // set an endDate < startDate
        act(() => {
          result.current.setEndDate(date1);
        });
        expect(isSameDay(result.current.startDate!, date2)).toBe(true);
        expect(result.current.endDate).toBeNull();

        expect(result.current.months[0]).toMatchInlineSnapshot(`
  |                Jan 2021                 |
  |-----------------------------------------|
  |
  |     |     |     |     |     |  01 |  02 |
  |  03 |  04 |  05 |  06 |  07 |  08 |  ** |
  |  10 |  11 |  12 |  13 |  14 |  15 |  16 |
  |  17 |  18 |  19 |  20 |  21 |  22 |  23 |
  |  24 |  25 |  26 |  27 |  28 |  29 |  30 |
  |  31 |     |     |     |     |     |     |
`);
      });
    });

    describe('functional value', () => {
      test('works without any checks', () => {
        const date1 = new Date(YEAR, 0 /* Jan */, 1, 0, 0, 0, 0);
        const date2 = new Date(YEAR, 0 /* Jan */, 5, 0, 0, 0, 0);
        const date3 = new Date(YEAR, 0 /* Jan */, 9, 0, 0, 0, 0);
        const { result } = renderHook(() => useDateRange(months.slice(0, 3)));

        expect(result.current.startDate).toBeNull();
        expect(result.current.endDate).toBeNull();
        expect(result.current.months[0]).toMatchInlineSnapshot(`
  |                Jan 2021                 |
  |-----------------------------------------|
  |
  |     |     |     |     |     |  01 |  02 |
  |  03 |  04 |  05 |  06 |  07 |  08 |  09 |
  |  10 |  11 |  12 |  13 |  14 |  15 |  16 |
  |  17 |  18 |  19 |  20 |  21 |  22 |  23 |
  |  24 |  25 |  26 |  27 |  28 |  29 |  30 |
  |  31 |     |     |     |     |     |     |
`);

        // set a startDate
        act(() => {
          result.current.setStartDate(() => date1);
        });
        expect(isSameDay(result.current.startDate!, date1)).toBe(true);
        expect(result.current.endDate).toBeNull();

        expect(result.current.months[0]).toMatchInlineSnapshot(`
  |                Jan 2021                 |
  |-----------------------------------------|
  |
  |     |     |     |     |     |  ** |  02 |
  |  03 |  04 |  05 |  06 |  07 |  08 |  09 |
  |  10 |  11 |  12 |  13 |  14 |  15 |  16 |
  |  17 |  18 |  19 |  20 |  21 |  22 |  23 |
  |  24 |  25 |  26 |  27 |  28 |  29 |  30 |
  |  31 |     |     |     |     |     |     |
`);

        act(() => {
          result.current.setEndDate(() => date3);
        });
        expect(isSameDay(result.current.startDate!, date1)).toBe(true);
        expect(isSameDay(result.current.endDate!, date3)).toBe(true);

        expect(result.current.months[0]).toMatchInlineSnapshot(`
  |                Jan 2021                 |
  |-----------------------------------------|
  |
  |     |     |     |     |     |  ** |  ** |
  |  ** |  ** |  ** |  ** |  ** |  ** |  ** |
  |  10 |  11 |  12 |  13 |  14 |  15 |  16 |
  |  17 |  18 |  19 |  20 |  21 |  22 |  23 |
  |  24 |  25 |  26 |  27 |  28 |  29 |  30 |
  |  31 |     |     |     |     |     |     |
`);

        // set a endDate
        act(() => {
          result.current.setEndDate(() => date2);
        });
        expect(isSameDay(result.current.endDate!, date2)).toBe(true);

        expect(result.current.months[0]).toMatchInlineSnapshot(`
  |                Jan 2021                 |
  |-----------------------------------------|
  |
  |     |     |     |     |     |  ** |  ** |
  |  ** |  ** |  ** |  06 |  07 |  08 |  09 |
  |  10 |  11 |  12 |  13 |  14 |  15 |  16 |
  |  17 |  18 |  19 |  20 |  21 |  22 |  23 |
  |  24 |  25 |  26 |  27 |  28 |  29 |  30 |
  |  31 |     |     |     |     |     |     |
`);

        // set an endDate > startDate
        act(() => {
          result.current.setStartDate(() => date3);
          result.current.setEndDate(() => date1);
        });
        expect(isSameDay(result.current.startDate!, date3)).toBe(true);
        expect(isSameDay(result.current.endDate!, date1)).toBe(true);

        expect(result.current.months[0]).toMatchInlineSnapshot(`
  |                Jan 2021                 |
  |-----------------------------------------|
  |
  |     |     |     |     |     |  ** |  02 |
  |  03 |  04 |  05 |  06 |  07 |  08 |  ** |
  |  10 |  11 |  12 |  13 |  14 |  15 |  16 |
  |  17 |  18 |  19 |  20 |  21 |  22 |  23 |
  |  24 |  25 |  26 |  27 |  28 |  29 |  30 |
  |  31 |     |     |     |     |     |     |
`);
      });
    });
  });

  test('setMonths works', () => {
    const { result } = renderHook(() => useDateRange(months.slice(0, 3)));

    expect(result.current.months[0]).toMatchInlineSnapshot(`
  |                Jan 2021                 |
  |-----------------------------------------|
  |
  |     |     |     |     |     |  01 |  02 |
  |  03 |  04 |  05 |  06 |  07 |  08 |  09 |
  |  10 |  11 |  12 |  13 |  14 |  15 |  16 |
  |  17 |  18 |  19 |  20 |  21 |  22 |  23 |
  |  24 |  25 |  26 |  27 |  28 |  29 |  30 |
  |  31 |     |     |     |     |     |     |
`);
    expect(result.current.months[1]).toMatchInlineSnapshot(`
  |                Feb 2021                 |
  |-----------------------------------------|
  |
  |     |  01 |  02 |  03 |  04 |  05 |  06 |
  |  07 |  08 |  09 |  10 |  11 |  12 |  13 |
  |  14 |  15 |  16 |  17 |  18 |  19 |  20 |
  |  21 |  22 |  23 |  24 |  25 |  26 |  27 |
  |  28 |     |     |     |     |     |     |
  |     |     |     |     |     |     |     |
`);
    expect(result.current.months[2]).toMatchInlineSnapshot(`
  |                Mar 2021                 |
  |-----------------------------------------|
  |
  |     |  01 |  02 |  03 |  04 |  05 |  06 |
  |  07 |  08 |  09 |  10 |  11 |  12 |  13 |
  |  14 |  15 |  16 |  17 |  18 |  19 |  20 |
  |  21 |  22 |  23 |  24 |  25 |  26 |  27 |
  |  28 |  29 |  30 |  31 |     |     |     |
  |     |     |     |     |     |     |     |
`);

    act(() => {
      result.current.setMonths(months.slice(3, 6));
    });

    expect(result.current.months[0]).toMatchInlineSnapshot(`
  |                Apr 2021                 |
  |-----------------------------------------|
  |
  |     |     |     |     |  01 |  02 |  03 |
  |  04 |  05 |  06 |  07 |  08 |  09 |  10 |
  |  11 |  12 |  13 |  14 |  15 |  16 |  17 |
  |  18 |  19 |  20 |  21 |  22 |  23 |  24 |
  |  25 |  26 |  27 |  28 |  29 |  30 |     |
  |     |     |     |     |     |     |     |
`);
    expect(result.current.months[1]).toMatchInlineSnapshot(`
  |                May 2021                 |
  |-----------------------------------------|
  |
  |     |     |     |     |     |     |  01 |
  |  02 |  03 |  04 |  05 |  06 |  07 |  08 |
  |  09 |  10 |  11 |  12 |  13 |  14 |  15 |
  |  16 |  17 |  18 |  19 |  20 |  21 |  22 |
  |  23 |  24 |  25 |  26 |  27 |  28 |  29 |
  |  30 |  31 |     |     |     |     |     |
`);
    expect(result.current.months[2]).toMatchInlineSnapshot(`
  |                Jun 2021                 |
  |-----------------------------------------|
  |
  |     |     |  01 |  02 |  03 |  04 |  05 |
  |  06 |  07 |  08 |  09 |  10 |  11 |  12 |
  |  13 |  14 |  15 |  16 |  17 |  18 |  19 |
  |  20 |  21 |  22 |  23 |  24 |  25 |  26 |
  |  27 |  28 |  29 |  30 |     |     |     |
  |     |     |     |     |     |     |     |
`);
  });

  test('changing `weekStartsOn` works', () => {
    const { result } = renderHook(() => useDateRange(months.slice(0, 3)));
    expect(result.current.daysOfWeek[0]).toBe(DayName.SUNDAY);
    expect(result.current.months[0]).toMatchInlineSnapshot(`
  |                Jan 2021                 |
  |-----------------------------------------|
  |
  |     |     |     |     |     |  01 |  02 |
  |  03 |  04 |  05 |  06 |  07 |  08 |  09 |
  |  10 |  11 |  12 |  13 |  14 |  15 |  16 |
  |  17 |  18 |  19 |  20 |  21 |  22 |  23 |
  |  24 |  25 |  26 |  27 |  28 |  29 |  30 |
  |  31 |     |     |     |     |     |     |
`);

    act(() => {
      result.current.setStartOfWeek(DayName.MONDAY);
    });

    expect(result.current.daysOfWeek[0]).toBe(DayName.MONDAY);
    expect(result.current.months[0]).toMatchInlineSnapshot(`
  |                Jan 2021                 |
  |-----------------------------------------|
  |
  |     |     |     |     |  01 |  02 |  03 |
  |  04 |  05 |  06 |  07 |  08 |  09 |  10 |
  |  11 |  12 |  13 |  14 |  15 |  16 |  17 |
  |  18 |  19 |  20 |  21 |  22 |  23 |  24 |
  |  25 |  26 |  27 |  28 |  29 |  30 |  31 |
  |     |     |     |     |     |     |     |
`);
  });
});
