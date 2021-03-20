import { renderHook, act } from '@testing-library/react-hooks';

import { useCalendar } from '../useCalendar';
import { isSameMonth, DayName } from '../utils';

import MonthSerializer from './MonthSerializer';

expect.addSnapshotSerializer(MonthSerializer);

const YEAR = 2021;

describe('useCalendar hook tests', () => {
    test('gives correct days & month', () => {
        const date = new Date(YEAR, 0 /* Jan */, 1, 0, 0, 0, 0);
        const { result } = renderHook(() => useCalendar(date));

        expect(result.current).toMatchInlineSnapshot(`
              |                Jan 2021                 |
              |-----------------------------------------|
              | SUN | MON | TUE | WED | THU | FRI | SAT |
              |     |     |     |     |     |  01 |  02 |
              |  03 |  04 |  05 |  06 |  07 |  08 |  09 |
              |  10 |  11 |  12 |  13 |  14 |  15 |  16 |
              |  17 |  18 |  19 |  20 |  21 |  22 |  23 |
              |  24 |  25 |  26 |  27 |  28 |  29 |  30 |
              |  31 |     |     |     |     |     |     |
        `);
        expect(isSameMonth(result.current.month, date)).toBe(true);
    });

    test('setMonth works', () => {
        const date1 = new Date(YEAR, 0 /* Jan */, 1, 0, 0, 0, 0);
        const date2 = new Date(YEAR, 3 /* Apr */, 1, 0, 0, 0, 0);
        const { result } = renderHook(() => useCalendar(date1));

        expect(isSameMonth(result.current.month, date1)).toBe(true);
        expect(result.current).toMatchInlineSnapshot(`
              |                Jan 2021                 |
              |-----------------------------------------|
              | SUN | MON | TUE | WED | THU | FRI | SAT |
              |     |     |     |     |     |  01 |  02 |
              |  03 |  04 |  05 |  06 |  07 |  08 |  09 |
              |  10 |  11 |  12 |  13 |  14 |  15 |  16 |
              |  17 |  18 |  19 |  20 |  21 |  22 |  23 |
              |  24 |  25 |  26 |  27 |  28 |  29 |  30 |
              |  31 |     |     |     |     |     |     |
        `);

        act(() => {
            result.current.setMonth(date2);
        });
        expect(result.current).toMatchInlineSnapshot(`
              |                Apr 2021                 |
              |-----------------------------------------|
              | SUN | MON | TUE | WED | THU | FRI | SAT |
              |     |     |     |     |  01 |  02 |  03 |
              |  04 |  05 |  06 |  07 |  08 |  09 |  10 |
              |  11 |  12 |  13 |  14 |  15 |  16 |  17 |
              |  18 |  19 |  20 |  21 |  22 |  23 |  24 |
              |  25 |  26 |  27 |  28 |  29 |  30 |     |
              |     |     |     |     |     |     |     |
        `);
        expect(isSameMonth(result.current.month, date2)).toBe(true);
    });

    test('setStartOfWeek', () => {
        const date = new Date(YEAR, 0 /* Jan */, 1, 0, 0, 0, 0);
        const { result } = renderHook(() => useCalendar(date));

        expect(result.current.daysOfWeek[0]).toBe(DayName.SUNDAY);
        expect(result.current).toMatchInlineSnapshot(`
              |                Jan 2021                 |
              |-----------------------------------------|
              | SUN | MON | TUE | WED | THU | FRI | SAT |
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
        expect(result.current).toMatchInlineSnapshot(`
              |                Jan 2021                 |
              |-----------------------------------------|
              | MON | TUE | WED | THU | FRI | SAT | SUN |
              |     |     |     |     |  01 |  02 |  03 |
              |  04 |  05 |  06 |  07 |  08 |  09 |  10 |
              |  11 |  12 |  13 |  14 |  15 |  16 |  17 |
              |  18 |  19 |  20 |  21 |  22 |  23 |  24 |
              |  25 |  26 |  27 |  28 |  29 |  30 |  31 |
              |     |     |     |     |     |     |     |
        `);
    });
});
