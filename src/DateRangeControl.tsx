import * as React from 'react';

import { CalendarMonthProps } from './CalendarMonth';
import { startOfMonth, addMonths, isSameDay, isDayAfter, isDayBefore, callIfExists } from './utils';

export interface DateRange {
    startDate: Date;
    endDate: Date;
}

export type PickedCalendarMonthProps = Pick<
    CalendarMonthProps,
    'showDropdowns' | 'startDate' | 'endDate' | 'minDate' | 'maxDate'
>;

export interface DateRangeControlRenderProps extends PickedCalendarMonthProps {
    onDayClick(date: Date): void;
    onDayHover(date: Date): void;
    months: Date[];
    moveForward(): void;
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
    showThreeMonths?: boolean;
    render(props: DateRangeControlRenderProps): React.ReactNode;
}

export interface DateRangeControlState {
    startDate?: Date;
    endDate?: Date;
    months: Date[];
    selectionActive: boolean;
}

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
            selectionActive: false
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
                    addMonths(startDate || state.months[0], i)
                )
            };
        });
    }

    handleDayClick = (day: Date) => {
        this.setState<'startDate' | 'endDate' | 'selectionActive'>((state) => {
            if (
                state.startDate &&
                state.selectionActive &&
                (isSameDay(day, state.startDate) || isDayAfter(day, state.startDate))
            ) {
                callIfExists(this.props.onDatesChange, {
                    startDate: state.startDate,
                    endDate: day
                });

                return {
                    selectionActive: false,
                    endDate: day
                };
            }

            callIfExists(this.props.onDatesChange, {
                startDate: day,
                endDate: undefined
            });

            return {
                selectionActive: true,
                startDate: day,
                endDate: undefined
            };
        });
    };

    handleDayHover = (day: Date) => {
        this.setState<'endDate'>((state) => {
            if (state.selectionActive && state.startDate && !isDayBefore(day, state.startDate)) {
                return {
                    endDate: day
                };
            }

            return {};
        });
    };

    handleNavigation = (months: number) => () => {
        this.setState<'months'>((state) => {
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
