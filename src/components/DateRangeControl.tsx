import * as React from 'react';

import { startOfMonth, addMonths, isDayBefore, callIfExists } from '../utils';
import { DateRangeControlProps, DateRangeControlState } from './types';

/**
 * Controller component for making a date-range picker in conjunction with [CalendarMonth]()
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
