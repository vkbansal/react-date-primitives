import * as React from 'react';
import { CalendarMonth } from '../../src/CalendarMonth';
import * as addMonths from 'date-fns/addMonths';

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

export class SimpleDatePicker extends React.Component<{}, { month: Date }> {
    constructor(props: {}) {
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
                                        <td key={`${i}-${j}`}>{day ? day.date.getDate() : ''}</td>
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
