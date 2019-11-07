import * as React from 'react';

import { CalendarMonthProps } from './CalendarMonth';
import { startOfMonth, addMonths, isDayBefore, callIfExists } from './utils';

/**
 * Object representing a date range
 */
export interface DateRange {
    /**
     * Starting date of the range
     */
    startDate: Date;
    /**
     * End date of the range
     */
    endDate?: Date;
}

/**
 * @private
 */
export type PickedCalendarMonthProps = Pick<
    CalendarMonthProps,
    'startDate' | 'endDate' | 'minDate' | 'maxDate'
>;

/**
 * DateRangeControl `render` prop is called with this object
 */
export interface DateRangeControlRenderProps extends PickedCalendarMonthProps {
    /**
     * Callback for handling click on a date
     */
    onDayClick(date: Date): void;
    /**
     * Callback for handling mouse hover on a date
     */
    onDayHover(date: Date): void;
    /**
     * The months to be shown to the user
     */
    months: Date[];
    /**
     * Callback for moving to next month
     */
    moveForward(): void;
    /**
     * Callback for moving to prev month
     */
    moveBackward(): void;
}

export interface DateRangeControlProps extends PickedCalendarMonthProps {
    /**
     * Callback when start and/or end dates are changed
     *
     * @param {Object} dates
     * @param {Date} dates.startDate
     * @param {Date | undefined} dates.endDate
     */
    onDatesChange?(dates: DateRange): void;
    /**
     * By default 2 consecutive months will be shown,
     * but if you want to show 3 months instead, set this to `true`
     */
    showThreeMonths?: boolean;
    /**
     * The main function, which be used for rendering.
     * It is called with an object.
     *
     * @see DateRangeControlRenderProps
     */
    render(props: DateRangeControlRenderProps): React.ReactNode;
}

/**
 * @private
 */
export interface DateRangeControlState {
    startDate?: Date;
    endDate?: Date;
    months: Date[];
    selectionActive: boolean;
}

/**
 * Primitive react component for making a date-range picker
 *
 * @borrows CalendarMonthProps
 * @example docs/examples/SimpleDateRangePicker.js
 */
export class DateRangeControl extends React.Component<
    DateRangeControlProps,
    DateRangeControlState
> {
    private numOfMonths: 2 | 3;

    constructor(props: DateRangeControlProps) {
        super(props);

        const { startDate, endDate, showThreeMonths } = props;

        this.numOfMonths = showThreeMonths ? 3 : 2;
        const thisMonth = startOfMonth(new Date());

        this.state = {
            startDate,
            endDate,
            months: Array.from({ length: this.numOfMonths }, (_, i) =>
                addMonths(startDate || thisMonth, i)
            ),
            selectionActive: startDate && !endDate ? true : false
        };
    }

    componentWillReceiveProps(nextProps: DateRangeControlProps) {
        const { startDate, endDate } = nextProps;

        this.setState((state) => {
            return {
                ...state,
                startDate,
                endDate,
                months: Array.from({ length: this.numOfMonths }, (_, i) =>
                    addMonths(state.months[0], i)
                )
            };
        });
    }

    handleDayClick = (day: Date) => {
        this.setState((state) => {
            const { startDate, selectionActive } = state;

            let newState: Pick<DateRangeControlProps, 'startDate' | 'endDate'>;

            if (startDate && selectionActive && !isDayBefore(day, startDate)) {
                newState = {
                    startDate,
                    endDate: day
                };

                callIfExists(this.props.onDatesChange, newState);

                return {
                    selectionActive: false,
                    ...newState
                };
            }

            newState = {
                startDate: day,
                endDate: undefined
            };

            callIfExists(this.props.onDatesChange, newState);

            return {
                selectionActive: true,
                ...newState
            };
        });
    };

    handleDayHover = (day: Date) => {
        const { selectionActive, startDate } = this.state;

        if (selectionActive && startDate && !isDayBefore(day, startDate)) {
            this.setState(() => ({
                endDate: day
            }));
        }
    };

    handleNavigation = (months: number) => () => {
        this.setState((state) => {
            return {
                months: state.months.map((month) => addMonths(month, months))
            };
        });
    };

    render() {
        const { render, minDate, maxDate } = this.props;
        const { months, startDate, endDate } = this.state;

        return render({
            months,
            startDate,
            endDate,
            minDate,
            maxDate,
            onDayClick: this.handleDayClick,
            onDayHover: this.handleDayHover,
            moveForward: this.handleNavigation(1),
            moveBackward: this.handleNavigation(-1)
        });
    }
}
