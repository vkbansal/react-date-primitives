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
import addMonths from 'date-fns/addMonths'; // This is not required, you can use the package of your choice!

const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

class SimpleDatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            month: new Date()
        };
    }

    render() {
        const { month } = this.state;

        return (
            <table>
                <thead>
                    <tr>
                        <th>
                            <button onClick={() => this.setState({ month: addMonths(month, -1) })}>
                                &lt;
                            </button>
                        </th>
                        <th colSpan={5}>
                            {MONTH_NAMES[month.getMonth()]} {month.getFullYear()}
                        </th>
                        <th>
                            <button onClick={() => this.setState({ month: addMonths(month, 1) })}>
                                &gt;
                            </button>
                        </th>
                    </tr>
                    <tr>
                        <th>Sun</th>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Sat</th>
                    </tr>
                </thead>
                <CalendarMonth
                    month={month}
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

More examples and docs are coming soon!

## License

[MIT](./LICENSE.md). Copyright(c) [Vivek Kumar Bansal](http://vkbansal.me/)

[npm-url]: https://npmjs.org/package/react-date-primitives
[npm-image]: https://img.shields.io/npm/v/react-date-primitives.svg?style=flat-square
[travis-url]: https://travis-ci.org/vkbansal/react-date-primitives
[travis-image]: https://img.shields.io/travis/vkbansal/react-date-primitives/master.svg?style=flat-square
