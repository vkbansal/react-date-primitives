import * as React from 'react';
import { useCalendar } from '@vkbansal/react-date-primitives';

/**
 * Use your favourite date library (eg: moment, date-fns, etc).
 */
import { addMonths, isSameDay } from 'date-fns/esm';

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

export default function UseCalendarHooksExample(): React.ReactElement {
    const { days, setMonth, month } = useCalendar();
    const [selected, setSelected] = React.useState(new Date());

    function handleMonthIncrement(): void {
        setMonth(addMonths(month, 1));
    }

    function handleMonthDecrement(): void {
        setMonth(addMonths(month, -1));
    }

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
                                onClick={(): void => {
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
