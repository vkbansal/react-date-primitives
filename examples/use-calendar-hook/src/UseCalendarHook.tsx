import * as React from 'react';
import { useCalendar } from 'react-date-primitives';

/**
 * These are internal modules to `react-date-primitives` and are used only for demo purposes only.
 * Please do not use in production. This might break in future without any notice.
 *
 * Use your favourite date library (eg: moment, date-fns, etc.) instead.
 */
import { addMonths, isSameDay } from 'react-date-primitives/esm/utils';

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

export function UseCalendarHooks() {
    const { days, setMonth, month } = useCalendar();
    const [selected, setSelected] = React.useState(new Date());

    function handleMonthIncrement() {
        setMonth(addMonths(month, 1));
    }

    function handleMonthDecrement() {
        setMonth(addMonths(month, -1));
    }

    // handleDayClick = (day: DayOfMonth) => () => {
    //     this.setState({ day: day.date });
    // };

    const monthName = MONTH_NAMES[month.getMonth()];

    return (
        <table style={{ textAlign: 'center' }}>
            <thead>
                <tr>
                    <th>
                        <button onClick={handleMonthDecrement}>&lt;</button>
                    </th>
                    <th colSpan={5}>
                        {monthName} {month.getFullYear()}
                    </th>
                    <th>
                        <button onClick={handleMonthIncrement}>&gt;</button>
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
                                    background: isSameDay(d.date, selected) ? '#ccc' : 'transparent'
                                }}
                                key={`${i}-${j}`}
                                onClick={() => {
                                    d.inCurrentMonth && setSelected(d.date);
                                }}
                            >
                                {d.date.getDate()}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
