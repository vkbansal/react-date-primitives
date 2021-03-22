import Handlebars from 'handlebars';
import { Month, DayOfMonth, DayOfRangeMonth } from '../utils';

export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

Handlebars.registerHelper('monthName', (value: Date) => monthNames[value.getMonth()]);
Handlebars.registerHelper('year', (value: Date) => value.getFullYear());
Handlebars.registerHelper('shortDay', (val: string) => val.slice(0, 3));
Handlebars.registerHelper('date', (val: DayOfRangeMonth) =>
  val.inCurrentMonth
    ? val.inRange
      ? '**'
      : val.dateObj.getDate().toString().padStart(2, '0')
    : '  '
);
Handlebars.registerHelper('month', (val: DayOfMonth) =>
  val.inCurrentMonth ? val.dateObj.getDate().toString().padStart(2, '0') : '  '
);

const monthTemplate = Handlebars.compile(`
  |                {{monthName month}} {{year month}}                 |
  |-----------------------------------------|
  |{{#each daysOfWeek}} {{shortDay this}} |{{/each}}
  {{#each chunked}}
  |{{#each this}}  {{date this}} |{{/each}}
  {{/each}}
`);

function chunk<T>(arr: T[], length: number): T[][] {
  const chunked: T[][] = [];

  let i = 0;

  while (i < arr.length) {
    chunked.push(arr.slice(i, i + length));
    i = i + length;
  }

  return chunked;
}

const serializer: jest.SnapshotSerializerPlugin = {
  print(val: unknown): string {
    const month = val as Month;

    return monthTemplate({
      ...month,
      chunked: chunk(month.days, 7)
    })
      .replace(/^\n*/, '')
      .trimEnd();
  },
  test(val: unknown): val is Month {
    const month = val as Month;
    return Array.isArray(month.days) && month.days.length === 42;
  }
};

export default serializer;
