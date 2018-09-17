import * as React from 'react';
import { CalendarMonth, DayOfMonth } from 'react-date-primitives';

/**
 * These are internal modules to `react-date-primitives` and are used only for demo purposes only.
 * Please do not use in production. This might break in future without any notice.
 *
 * Use your favourite date library (eg: moment, date-fns, etc.) instead.
 */
import { addMonths, setMonth, setYear } from 'react-date-primitives/esm/components/utils';

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

export class SimpleDatePicker extends React.Component<{}, SimpleDatePickerState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            month: new Date(),
            day: new Date()
        };
    }

    handleMonthIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.setState((state) => ({
            month: addMonths(state.month, 1)
        }));
    };

    handleMonthDecrement = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.setState((state) => ({
            month: addMonths(state.month, -1)
        }));
    };

    handleDayClick = (day: DayOfMonth) => () => {
        this.setState({ day: day.date });
    };

    handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const month = parseInt(e.target.value, 10);

        this.setState((state) => ({
            month: setMonth(state.month, month)
        }));
    };

    handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const year = parseInt(e.target.value, 10);

        this.setState((state) => ({
            month: setYear(state.month, year)
        }));
    };

    render() {
        const { month, day } = this.state;

        return (
            <table style={{ textAlign: 'center' }}>
                <CalendarMonth
                    month={month}
                    startDate={day}
                    showDropdowns
                    render={({ days, monthsDropdown, yearsDropdown }) => (
                        <React.Fragment>
                            <thead>
                                <tr>
                                    <th>
                                        <button onClick={this.handleMonthDecrement}>&lt;</button>
                                    </th>
                                    <th colSpan={5}>
                                        {monthsDropdown && (
                                            <select
                                                value={month.getMonth()}
                                                onChange={this.handleMonthChange}
                                            >
                                                {monthsDropdown.map((m, i) => (
                                                    <option
                                                        key={i}
                                                        value={m.value}
                                                        disabled={m.disabled}
                                                    >
                                                        {MONTH_NAMES[m.value]}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        {yearsDropdown && (
                                            <select
                                                value={month.getFullYear()}
                                                onChange={this.handleYearChange}
                                            >
                                                {yearsDropdown.map((y, i) => (
                                                    <option
                                                        key={i}
                                                        value={y.value}
                                                        disabled={y.disabled}
                                                    >
                                                        {y.value}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </th>
                                    <th>
                                        <button onClick={this.handleMonthIncrement}>&gt;</button>
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
                            <tbody>
                                {days.map((week, i) => (
                                    <tr key={i}>
                                        {week.map((d, j) => (
                                            <td
                                                style={{
                                                    opacity: d.inCurrentMonth ? 1 : 0.2,
                                                    background: d.selected ? '#ddd' : 'transparent'
                                                }}
                                                key={`${i}-${j}`}
                                                onClick={this.handleDayClick(d)}
                                            >
                                                {d ? d.date.getDate() : ''}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </React.Fragment>
                    )}
                />
            </table>
        );
    }
}
