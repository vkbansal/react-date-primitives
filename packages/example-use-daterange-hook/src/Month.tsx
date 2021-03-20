import * as React from 'react';
import { useCalendar, UseDateRange } from 'react-date-primitives';

export interface MonthProps extends Pick<UseDateRange, 'processMonth'> {
    month: Date;
    onPrevClick?(): void;
    onNextClick?(): void;
    onDayClick(day: Date): void;
    onDayHover(day: Date): void;
}

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

export function Month(props: MonthProps) {
    const { days, month } = useCalendar(props.month);
    const monthName = MONTH_NAMES[month.getMonth()];
    const rangedays = props.processMonth(days);

    return (
        <table style={{ textAlign: 'center' }}>
            <thead>
                <tr>
                    <th>
                        <button onClick={props.onPrevClick}>&lt;</button>
                    </th>
                    <th colSpan={5}>
                        {monthName} {month.getFullYear()}
                    </th>
                    <th>
                        <button onClick={props.onNextClick}>&gt;</button>
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
                {rangedays.map((week, i) => (
                    <tr key={i}>
                        {week.map((d, j) => (
                            <td
                                style={{
                                    opacity: d.inCurrentMonth ? 1 : 0.2,
                                    background:
                                        d.inCurrentMonth && d.selected
                                            ? '#aaa'
                                            : d.inCurrentMonth && d.inRange
                                            ? '#ddd'
                                            : 'transparent'
                                }}
                                key={`${i}-${j}`}
                                onClick={() => {
                                    d.inCurrentMonth && props.onDayClick(d.date);
                                }}
                                onMouseOver={() => {
                                    d.inCurrentMonth && props.onDayHover(d.date);
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
