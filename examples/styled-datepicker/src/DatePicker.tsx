import * as React from 'react';
import { useCalendar, DayOfMonth } from 'react-date-primitives';
/**
 * These are internal modules to `react-date-primitives` and are used only for demo purposes only.
 * Please do not use in production. This might break in future without any notice.
 *
 * Use your favourite date library (eg: moment, date-fns, etc.) instead.
 */
import { addMonths, isSameDay } from 'react-date-primitives/esm/utils';

import {
    Wrapper,
    LHS,
    LHSDay,
    LHSDate,
    LHSMonthAndYear,
    RHS,
    RHSMonthName,
    Button,
    Cell,
    Day
} from './Components';

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

export const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const DAYS_LONG = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

export interface SimpleDatePickerState {
    month: Date;
    day: Date;
}

export function DatePicker() {
    const { month, setMonth, days } = useCalendar();
    const [day, setDay] = React.useState(new Date());
    const monthName = MONTH_NAMES[month.getMonth()];

    function handleDayClick(currentDay: DayOfMonth) {
        return () => {
            setDay(currentDay.date);
        };
    }

    function handleMonthIncrement() {
        setMonth(addMonths(month, 1));
    }

    function handleMonthDecrement() {
        setMonth(addMonths(month, -1));
    }

    return (
        <Wrapper>
            <LHS>
                <LHSDay>{DAYS_LONG[day.getDay()]}</LHSDay>
                <LHSDate>{day.getDate()}</LHSDate>
                <LHSMonthAndYear>
                    {MONTH_NAMES[day.getMonth()]} {day.getFullYear()}
                </LHSMonthAndYear>
            </LHS>
            <RHS>
                <RHSMonthName>
                    {monthName} {month.getFullYear()}
                </RHSMonthName>
                <div>
                    <Button direction="left" onClick={handleMonthDecrement}>
                        &lt;
                    </Button>
                </div>
                <div>
                    <Button direction="right" onClick={handleMonthIncrement}>
                        &gt;
                    </Button>
                </div>
                {DAYS_SHORT.map((d, i) => (
                    <Cell style={{ fontWeight: 'bold' }} key={i}>
                        {d}
                    </Cell>
                ))}
                {days.map((week, i) =>
                    week.map((d, j) => (
                        <Day
                            {...d}
                            selected={isSameDay(d.date, day)}
                            key={`${i}-${j}`}
                            onClick={handleDayClick(d)}
                        >
                            {d ? d.date.getDate() : ''}
                        </Day>
                    ))
                )}
            </RHS>
        </Wrapper>
    );
}
