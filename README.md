# React Date Primitives

Primitives for creating Date-Picker and DateRange-Picker components in React. And It has zero dependencies!

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

## Installation

This package is distributed via [npm](https://www.npmjs.com/).

```
npm install --save react-date-primitives
```

> This package also depends on `react`. Please make sure you have those installed as well.

## Usage

```jsx
import * as React from 'react';
import { CalendarMonth } from 'react-date-primitives';

class SimpleDatePicker extends React.Component {
    render() {
        return (
            <table>
                <CalendarMonth
                    month={new Date()}
                    render={({ days }) => (
                        <tbody>
                            {days.map((week, i) => (
                                <tr key={i}>
                                    {week.map((day, j) => (
                                        <td key={`${i}-${j}`}>
                                            {day.inCurrentMonth ? day.date.getDate() : ''}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    )}
                />
            </table>
        );
    }
}
```

## Live Examples

-   [simple date-picker](https://codesandbox.io/s/github/vkbansal/react-date-primitives/tree/master/examples/simple-datepicker)
-   [simple date-picker with dropdowns for month and year](https://codesandbox.io/s/github/vkbansal/react-date-primitives/tree/master/examples/datepicker-dropdowns)
-   [simple daterange-picker using `CalendarMonth`](https://codesandbox.io/s/github/vkbansal/react-date-primitives/tree/master/examples/simple-daterangepicker)
-   [styled date-picker](https://codesandbox.io/s/github/vkbansal/react-date-primitives/tree/master/examples/styled-datepicker)
-   [`useCalendar` hook](https://codesandbox.io/s/github/vkbansal/react-date-primitives/tree/master/examples/use-calendar-hook)
-   [`useDateRange` hook](https://codesandbox.io/s/github/vkbansal/react-date-primitives/tree/master/examples/use-daterange-hook)

## API

-   [`CalendarMonth`](docs/CalendarMonth.md)
-   [`DateRangeControl`](docs/DateRangeControl.md)

## License

[MIT](./LICENSE.md). Copyright(c) [Vivek Kumar Bansal](http://vkbansal.me/)

[npm-url]: https://npmjs.org/package/react-date-primitives
[npm-image]: https://img.shields.io/npm/v/react-date-primitives.svg?style=flat-square
[travis-url]: https://travis-ci.org/vkbansal/react-date-primitives
[travis-image]: https://img.shields.io/travis/vkbansal/react-date-primitives/master.svg?style=flat-square
