import * as utils from '../utils';

import MonthSerializer from './MonthSerializer';
import DateSerializer from './DateSerializer';

expect.addSnapshotSerializer(DateSerializer);
expect.addSnapshotSerializer(MonthSerializer);

const YEAR = 2021;

describe('utils test', () => {
  const month = new Date(YEAR, 0 /* Jan */, 1, 0, 0, 0, 0);

  afterEach(() => {
    expect(month).toBe(month); // immutability check
  });

  test('setDay', () => {
    const newDate = utils.setDay(month, 10);
    expect(newDate.getDate()).toBe(10);
    expect(newDate.getMonth()).toBe(month.getMonth());
    expect(newDate.getFullYear()).toBe(month.getFullYear());
  });

  test('addDays', () => {
    let newDate = utils.setDay(month, 10);
    newDate = utils.addDays(newDate, 10);
    expect(newDate.getDate()).toBe(20);
    expect(newDate.getMonth()).toBe(month.getMonth());
    expect(newDate.getFullYear()).toBe(month.getFullYear());
  });

  test('setMonth', () => {
    const newDate = utils.setMonth(month, 10);
    expect(newDate.getMonth()).toBe(10);
    expect(newDate.getDate()).toBe(month.getDate());
    expect(newDate.getFullYear()).toBe(month.getFullYear());
  });

  test('addMonths', () => {
    let newDate = utils.setMonth(month, 2);
    newDate = utils.addMonths(newDate, 3);
    expect(newDate.getMonth()).toBe(5);
    expect(newDate.getDate()).toBe(month.getDate());
    expect(newDate.getFullYear()).toBe(month.getFullYear());

    newDate = utils.addMonths(month, 14);
    expect(newDate.getMonth()).toBe(3);
    expect(newDate.getFullYear()).toBe(YEAR + 1);
  });

  test('setYear', () => {
    const newDate = utils.setYear(month, 2206);
    expect(newDate.getFullYear()).toBe(2206);
    expect(newDate.getDate()).toBe(month.getDate());
    expect(newDate.getMonth()).toBe(month.getMonth());
  });

  test('startOfMonth', () => {
    const date = new Date();
    const newDate = utils.startOfMonth(date);
    expect(newDate.getDate()).toBe(1);
    expect(newDate.getMonth()).toBe(date.getMonth());
    expect(newDate.getFullYear()).toBe(date.getFullYear());
  });

  test('endOfMonth', () => {
    const newDate = utils.endOfMonth(month);
    expect(newDate.getDate()).toBe(31);
    expect(newDate.getMonth()).toBe(month.getMonth());
    expect(newDate.getFullYear()).toBe(month.getFullYear());
  });

  test('isSameMonth', () => {
    expect(utils.isSameMonth(new Date(2014, 8 /* Sep */, 2), new Date(2014, 8 /* Sep */, 25))).toBe(
      true
    );

    expect(utils.isSameMonth(new Date(2014, 8 /* Sep */, 2), new Date(2013, 8 /* Sep */, 25))).toBe(
      false
    );
  });

  test('isSameDay', () => {
    expect(
      utils.isSameDay(new Date(2014, 8 /* Sep */, 4, 6, 0), new Date(2014, 8 /* Sep */, 4, 18, 0))
    ).toBe(true);

    expect(
      utils.isSameDay(new Date(2014, 8 /* Sep */, 4, 23, 59), new Date(2014, 8 /* Sep */, 5, 0, 0))
    ).toBe(false);
  });

  test('isDayAfter', () => {
    expect(utils.isDayAfter(new Date(1989, 6 /* Jul */, 10), new Date(1987, 1 /* Feb */, 11))).toBe(
      true
    );

    expect(utils.isDayAfter(new Date(1987, 1 /* Feb */, 11), new Date(1989, 6 /* Jul */, 10))).toBe(
      false
    );

    expect(utils.isDayAfter(new Date(1989, 6 /* Jul */, 10), new Date(1989, 6 /* Jul */, 10))).toBe(
      false
    );
  });

  test('isDayBefore', () => {
    expect(
      utils.isDayBefore(new Date(1987, 1 /* Feb */, 11), new Date(1989, 6 /* Jul */, 10))
    ).toBe(true);

    expect(
      utils.isDayBefore(new Date(1989, 6 /* Jul */, 10), new Date(1987, 1 /* Feb */, 11))
    ).toBe(false);

    expect(
      utils.isDayBefore(new Date(1989, 6 /* Jul */, 10), new Date(1989, 6 /* Jul */, 10))
    ).toBe(false);
  });

  test('callIfExists', () => {
    const callback = jest.fn();
    const args = [1, 2, 5, 'h'];

    expect(() => utils.callIfExists(undefined)).not.toThrow();
    utils.callIfExists(callback, ...args);
    expect(callback).toHaveBeenCalledWith(...args);
  });

  test('toISODateString', () => {
    expect(utils.toISODateString(new Date(1989, 6 /* Jul */, 10))).toBe('1989-07-10');
    expect(utils.toISODateString(new Date(1989, 1 /* Jul */, 11))).toBe('1989-02-11');
  });

  describe('getDaysOfMonth', () => {
    test('weeks start with SUNDAY by default', () => {
      const result = utils.getDaysOfMonth(month);
      expect(result.daysOfWeek[0]).toBe(utils.DayName.SUNDAY);
    });

    test('month obj has 42 days', () => {
      const result = utils.getDaysOfMonth(month);
      expect(result.days.length).toBe(42);
    });

    test.each(utils.DaysOfTheWeek)(`weeks start with %s`, (dayOfWeek) => {
      const result = utils.getDaysOfMonth(month, dayOfWeek);
      expect(result.daysOfWeek[0]).toBe(dayOfWeek);
      expect(result.days.length).toBe(42);
      expect(result).toMatchSnapshot();
    });
  });

  describe('getDaysOfRangeMonth', () => {
    test('works without startDate and endDate', () => {
      const months = Array.from({ length: 2 }, (_, i) => utils.addMonths(month, i));
      const result = utils.getDaysOfRangeMonth(months);
      expect(result.months[0]).toMatchSnapshot();
      expect(result.months[1]).toMatchSnapshot();
    });
  });
});
