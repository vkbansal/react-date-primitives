import * as React from 'react';
import { DateRangeControl, PickedCalendarMonthProps } from '../../src/DateRangeControl';
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

export interface MonthProps extends PickedCalendarMonthProps {
    month: Date;
    showLeftNav?: boolean;
    showRightNav?: boolean;
    onNextClick(): void;
    onPrevClick(): void;
    onDayClick(date: Date): void;
    onDayHover(date: Date): void;
}

export function Month(props: MonthProps) {
    const {
        month,
        showLeftNav,
        showRightNav,
        onPrevClick,
        onNextClick,
        onDayClick,
        onDayHover,
        ...rest
    } = props;

    return (
        <table>
            <thead>
                <tr>
                    {showLeftNav && (
                        <th>
                            <button onClick={onPrevClick}>&lt;</button>
                        </th>
                    )}
                    {showRightNav && <th />}
                    <th colSpan={showLeftNav || showRightNav ? 5 : 7}>
                        {MONTH_NAMES[month.getMonth()]} {month.getFullYear()}
                    </th>
                    {showLeftNav && <th />}
                    {showRightNav && (
                        <th>
                            <button onClick={onNextClick}>&gt;</button>
                        </th>
                    )}
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
                {...rest}
                render={({ days }) => (
                    <tbody>
                        {days.map((week, i) => (
                            <tr key={i}>
                                {week.map((day, j) => (
                                    <td
                                        style={{
                                            background: day
                                                ? day.selected
                                                    ? 'red'
                                                    : day.inRange ? 'pink' : '#fff'
                                                : '#fff'
                                        }}
                                        key={`${i}-${j}`}
                                        onMouseEnter={day ? () => onDayHover(day.date) : undefined}
                                        onClick={day ? () => onDayClick(day.date) : undefined}
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

export class SimpleDateRangePicker extends React.Component<{}, { month: Date }> {
    constructor(props: {}) {
        super(props);

        this.state = {
            month: new Date()
        };
    }

    render() {
        const { month: currentMonth } = this.state;

        return (
            <DateRangeControl
                render={({ months, moveBackward, moveForward, ...rest }) => {
                    return (
                        <div>
                            <div style={{ display: 'flex' }}>
                                {months.map((month, i) => {
                                    return (
                                        <Month
                                            showLeftNav={i === 0}
                                            showRightNav={i === months.length - 1}
                                            onNextClick={moveForward}
                                            onPrevClick={moveBackward}
                                            key={i}
                                            month={month}
                                            {...rest}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                }}
            />
        );
    }
}
