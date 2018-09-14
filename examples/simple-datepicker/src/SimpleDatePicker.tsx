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
