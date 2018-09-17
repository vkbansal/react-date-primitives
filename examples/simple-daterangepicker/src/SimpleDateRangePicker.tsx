import * as React from 'react';
import { CalendarMonth, DayOfMonth } from 'react-date-primitives';

/**
 * These are internal modules to `react-date-primitives` and are used only for demo purposes only.
 * Please do not use in production. This might break in future without any notice.
 *
 * Use your favourite date library (eg: moment, date-fns, etc.) instead.
 */
import { addMonths, isDayBefore } from 'react-date-primitives/esm/components/utils';

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

export class SimpleDateRangePicker extends React.Component<{}, SimpleDateRangePickerState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            month: new Date(),
            selectionActive: false
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
        this.setState((state) => {
            const { startDate, selectionActive } = state;

            if (startDate && selectionActive && !isDayBefore(day.date, startDate)) {
                return {
                    startDate,
                    selectionActive: false,
                    endDate: day.date
                };
            }

            return {
                startDate: day.date,
                endDate: undefined,
                selectionActive: true
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
                            <button onClick={this.handleMonthDecrement}>&lt;</button>
                        </th>
                        <th colSpan={5}>
                            {monthName} {month.getFullYear()}
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
                                                opacity: day.inCurrentMonth ? 1 : 0.2,
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
