import * as React from 'react';
import { CalendarMonth, DayOfMonth, CalendarMonthRenderProps } from 'react-date-primitives';

/**
 * These are internal modules to `react-date-primitives` and are used only for demo purposes only.
 * Please do not use in production. This might break in future without any notice.
 *
 * Use your favourite date library (eg: moment, date-fns, etc.) instead.
 */
import { addMonths } from 'react-date-primitives/esm/components/utils';

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

export class DatePicker extends React.Component<{}, SimpleDatePickerState> {
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

    renderMonth = (renderProps: CalendarMonthRenderProps) => {
        const { days } = renderProps;

        return (
            <React.Fragment>
                {days.map((week, i) =>
                    week.map((d, j) => (
                        <Day {...d} key={`${i}-${j}`} onClick={this.handleDayClick(d)}>
                            {d ? d.date.getDate() : ''}
                        </Day>
                    ))
                )}
            </React.Fragment>
        );
    };

    render() {
        const { month, day } = this.state;
        const monthName = MONTH_NAMES[month.getMonth()];

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
                        <Button direction="left" onClick={this.handleMonthDecrement}>
                            &nbsp;
                        </Button>
                    </div>
                    <div>
                        <Button direction="right" onClick={this.handleMonthIncrement}>
                            &nbsp;
                        </Button>
                    </div>
                    {DAYS_SHORT.map((d, i) => (
                        <Cell style={{ fontWeight: 'bold' }} key={i}>
                            {d}
                        </Cell>
                    ))}
                    <CalendarMonth month={month} startDate={day} render={this.renderMonth} />
                </RHS>
            </Wrapper>
        );
    }
}
