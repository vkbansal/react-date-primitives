# React Date Primitives

Primitives for creating Date-Picker and DateRange-Picker components in React with zero dependencies!

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

## Installation

This package is distributed via [npm](https://www.npmjs.com/).

```bash
npm install --save react-date-primitives
```

> This package also depends on `react`. Please make sure you have those installed as well.

## Usage

```jsx
import React from 'react';
import { useCalendar } from '@vkbansal/react-date-primitives';

/**
 * Use your favourite date library (eg: moment, date-fns, etc).
 */
import { isSameDay } from 'date-fns/esm';

function SimpleDatePicker() {
  const { days, month, setMonth } = useCalendar();
  const [selected, setSelected] = React.useState(new Date());

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)'
      }}
    >
      {days.map((day, i) => (
        <div
          style={{
            opacity: day.inCurrentMonth ? 1 : 0.2,
            background: isSameDay(day.dateObj, selected) ? '#ccc' : 'transparent'
          }}
          key={i}
          onClick={(): void => {
            day.inCurrentMonth && setSelected(day.dateObj);
          }}
        >
          {day.dateObj.getDate()}
        </div>
      ))}
    </div>
  );
}
```

## Live Examples

- [`useCalendar` hook](https://codesandbox.io/s/github/vkbansal/react-date-primitives/tree/master/packages/example-use-calendar-hook)
- [`useDateRange` hook](https://codesandbox.io/s/github/vkbansal/react-date-primitives/tree/master/packages/example-use-daterange-hook)

## License

[MIT](./LICENSE.md). Copyright(c) [Vivek Kumar Bansal](http://vkbansal.me/)

[npm-url]: https://npmjs.org/package/@vkbansal/react-date-primitives
[npm-image]: https://img.shields.io/npm/v/@vkbansal/react-date-primitives.svg?style=flat-square
[travis-url]: https://travis-ci.org/vkbansal/react-date-primitives
[travis-image]: https://img.shields.io/travis/vkbansal/react-date-primitives/master.svg?style=flat-square
