# `<CalendarMonth/>`

Primitive react component that can be used to make a datepicker.

<details>
    <summary><b>Simple Date Picker Code Example</b></summary>

```tsx
import * as React from 'react';
import { CalendarMonth, Day } from 'react-date-primitives';
import { addMonths } from 'react-date-primitives/esm/utils';

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

export interface SimpleDatePickerState {
    month: Date;
    day?: Date;
}

export class SimpleDatePicker extends React.Component<
    {},
    SimpleDatePickerState
> {
    constructor(props: {}) {
        super(props);

        this.state = {
            month: new Date(),
            day: new Date()
        };
    }

    handleMonthIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.setState(state => ({
            month: addMonths(state.month, 1)
        }));
    };

    handleMonthDecrement = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.setState(state => ({
            month: addMonths(state.month, -1)
        }));
    };

    handleDayClick = (day: Day) => () => {
        console.log(day);
        this.setState({ day: day.date });
    };

    render() {
        const { month, day } = this.state;
        const monthName = MONTH_NAMES[month.getMonth()];

        return (
            <table>
                <thead>
                    <tr>
                        <th>
                            <button onClick={this.handleMonthDecrement}>
                                &lt;
                            </button>
                        </th>
                        <th colSpan={5}>
                            {monthName} {month.getFullYear()}
                        </th>
                        <th>
                            <button onClick={this.handleMonthIncrement}>
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
                    startDate={day}
                    render={({ days }) => (
                        <tbody>
                            {days.map((week, i) => (
                                <tr key={i}>
                                    {week.map((day, j) => (
                                        <td
                                            style={{
                                                opacity: day.inCurrentMonth
                                                    ? 1
                                                    : 0.2,
                                                background: day.selected
                                                    ? '#ddd'
                                                    : 'transparent'
                                            }}
                                            key={`${i}-${j}`}
                                            onClick={this.handleDayClick(day)}
                                        >
                                            {day ? day.date.getDate() : ''}
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

</details>

<br>

[![Edit Simple date-picker](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/jjm94lyv53?module=%2Fsrc%2FSimpleDatePicker.tsx)

<details>
    <summary><b>Simple Date Range Picker Code Example</b></summary>

```tsx
import * as React from 'react';
import { CalendarMonth, Day } from 'react-date-primitives';
import { addMonths, isDayBefore } from 'react-date-primitives/esm/utils';

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

export interface SimpleDateRangePickerState {
    month: Date;
    startDate?: Date;
    endDate?: Date;
    selectionActive: boolean;
}

export class SimpleDateRangePicker extends React.Component<
    {},
    SimpleDateRangePickerState
> {
    constructor(props: {}) {
        super(props);

        this.state = {
            month: new Date(),
            selectionActive: false
        };
    }

    handleMonthIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.setState(state => ({
            month: addMonths(state.month, 1)
        }));
    };

    handleMonthDecrement = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.setState(state => ({
            month: addMonths(state.month, -1)
        }));
    };

    handleDayClick = (day: Day) => () => {
        this.setState(state => {
            const { startDate, selectionActive } = state;

            let newState: Pick<
                SimpleDateRangePickerState,
                'startDate' | 'endDate'
            >;

            if (
                startDate &&
                selectionActive &&
                !isDayBefore(day.date, startDate)
            ) {
                newState = {
                    startDate,
                    endDate: day.date
                };

                return {
                    selectionActive: false,
                    ...newState
                };
            }

            newState = {
                startDate: day.date,
                endDate: undefined
            };

            return {
                selectionActive: true,
                ...newState
            };
        });
    };

    render() {
        const { month, startDate, endDate } = this.state;
        const monthName = MONTH_NAMES[month.getMonth()];

        return (
            <table>
                <thead>
                    <tr>
                        <th>
                            <button onClick={this.handleMonthDecrement}>
                                &lt;
                            </button>
                        </th>
                        <th colSpan={5}>
                            {monthName} {month.getFullYear()}
                        </th>
                        <th>
                            <button onClick={this.handleMonthIncrement}>
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
                    startDate={startDate}
                    endDate={endDate}
                    render={({ days }) => (
                        <tbody>
                            {days.map((week, i) => (
                                <tr key={i}>
                                    {week.map((day, j) => (
                                        <td
                                            style={{
                                                opacity: day.inCurrentMonth
                                                    ? 1
                                                    : 0.2,
                                                background: day.inRange
                                                    ? '#ddd'
                                                    : day.selected
                                                        ? '#999'
                                                        : 'transparent'
                                            }}
                                            key={`${i}-${j}`}
                                            onClick={this.handleDayClick(day)}
                                        >
                                            {day ? day.date.getDate() : ''}
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

</details>

<br>

[![Edit simple date-range-picker](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/x90ozw987o?module=%2Fsrc%2FSimpleDateRangePicker.tsx)

## PropTypes

| prop | type | optional | description |
| ---- | ---- | -------- | ----------- |
| `month` | `Date` | No | Current month to be shown |
| `startDate` | `Date` | Yes | The initially selected date when using as a single date-picker. The start of the initially selected date range when used as a daterange-picker. |
| `endDate` | `Date` | Yes | The end of the initially selected date range (only required when used as a daterange-picker) |
| `minDate` | `Date` | Yes | The earliest date a user may select |
| `maxDate` | `Date` | Yes | The latest date a user may select |
| `showDropdowns` | `boolean` | Yes | If set as `true`, then `monthsDropdown` and `yearsDropdown` are populated in the argument given to `render` prop. |
| `render` | `(props: CalendarMonthRenderProps) => ReactNode` | No | The main function, which be used for rendering. See [CalendarMonthRenderProps](#calendarmonthrenderprops) |

### `CalendarMonthRenderProps`


| prop | type | optional | description |
| ---- | ---- | -------- | ----------- |
| `days` | `DayOfMonth[][]` | No | Days of current month. See [DayOfMonth](#dayofmonth) |
| `month` | `Date` | No | Current month. |
| `monthsDropdown` | `CalendarDropdownOption[]` | Yes | Values for creating month dropdown. Months start from `0`, similar to [`Date.proptotype.getMonth()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth). By default, this value is `undefined`. To populate it, set `showDropdowns` prop as `true`. See [CalendarDropdownOption](#calendardropdownoption) |
| `yearsDropdown` | `CalendarDropdownOption[]` | Yes | Values for creating year dropdown. By default, this value is `undefined`. To populate it, set `showDropdowns` prop as `true`. See [CalendarDropdownOption](#calendardropdownoption) |

        


### `DayOfMonth`


| prop | type | optional | description |
| ---- | ---- | -------- | ----------- |
| `date` | `Date` | No | The date |
| `inCurrentMonth` | `boolean` | No | Is the `date` in current month? |
| `inRange` | `boolean` | No | Is the `date` between `startDate` and `endDate`? By default this value is `false`. This will be populated correctly only when both `startDate` and `endDate` are defined and are valid. |
| `selected` | `boolean` | No | Is the date selected? |
| `disabled` | `boolean` | No | Is the date disabled? By default this value is `false`. It will be `true` for all the dates before `minDate` and after `maxDate`. |

        


### `CalendarDropdownOption`


| prop | type | optional | description |
| ---- | ---- | -------- | ----------- |
| `value` | `number` | No | Value of the dropdown |
| `selected` | `boolean` | No | Is the value selected? |
| `disabled` | `boolean` | No | Is the value disabled? |

        