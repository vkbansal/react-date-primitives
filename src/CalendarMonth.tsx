// tslint:disable:max-line-length
import * as React from 'react';

import {
    startOfMonth,
    isDayAfter,
    isDayBefore,
    isSameDay,
    setMonth,
    getDatesofMonth,
    DateOfMonth
} from './utils';

/**
 * CalendarMonth `render` prop is called with this object
 */
export interface CalendarMonthRenderProps {
    /**
     * Days of current month.
     *
     * @see Day
     * @nullable
     */
    days: Day[][];
    /**
     * Current month.
     */
    month: Date;
    /**
     * Values for creating month dropdown.
     * Months start from `0`, similar to [`Date.proptotype.getMonth()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth).
     * By default, this value is `undefined`. To populate it, set `showDropdowns` prop as `true`.
     *
     * @default undefined
     * @see CalendarDropdownProps
     */
    monthsDropdown?: CalendarDropdownProps[];
    /**
     * Values for creating year dropdown
     * By default, this value is `undefined`. To populate it, set `showDropdowns` prop as `true`.
     *
     * @default undefined
     * @see CalendarDropdownProps
     */
    yearsDropdown?: CalendarDropdownProps[];
}

/**
 * Dropdown Value
 */
export interface CalendarDropdownProps {
    /**
     * Value of the dropdown
     */
    value: number;
    /**
     * Is the value selected?
     */
    selected: boolean;
    /**
     * Is the value disabled?
     */
    disabled: boolean;
}

/**
 * A Day of the month
 *
 * @borrows DateOfMonth
 */
export interface Day extends DateOfMonth {
    /**
     * Is the date between `startDate` and `endDate`?
     */
    inRange: boolean;
    /**
     * Is the date selected?
     */
    selected: boolean;
    /**
     * Is the date disabled?
     */
    disabled: boolean;
}

export interface CalendarMonthProps {
    /**
     * Current Month
     */
    month: Date;
    /**
     * The start of the initially selected date range
     */
    startDate?: Date;
    /**
     * The end of the initially selected date range
     */
    endDate?: Date;
    /**
     * The earliest date a user may select
     */
    minDate?: Date;
    /**
     * The latest date a user may select
     */
    maxDate?: Date;
    /**
     * If set as `true`, shows `monthsDropdown` and `yearsDropdown` are populated in `render` props.
     */
    showDropdowns?: boolean;
    /**
     * The main function, which be used for rendering.
     * It is called with an object.
     *
     * @see CalendarMonthRenderProps
     */
    render(props: CalendarMonthRenderProps): React.ReactNode;
}

/**
 * Primitive react component that can be used show a month of make a datepicker.
 *
 * @example docs/examples/SimpleDatePicker.js
 */
export class CalendarMonth extends React.Component<CalendarMonthProps> {
    private monthsDropdown?: CalendarDropdownProps[];
    private yearsDropdown?: CalendarDropdownProps[];

    constructor(props: CalendarMonthProps) {
        super(props);

        if (props.showDropdowns) {
            const [dropdownMonths, dropdownYears] = this.getDropDowns(props);
            this.monthsDropdown = dropdownMonths;
            this.yearsDropdown = dropdownYears;
        }
    }

    componentWillReceiveProps(nextProps: CalendarMonthProps) {
        if (nextProps.showDropdowns) {
            const [dropdownMonths, dropdownYears] = this.getDropDowns(nextProps);
            this.monthsDropdown = dropdownMonths;
            this.yearsDropdown = dropdownYears;
        } else {
            this.monthsDropdown = undefined;
            this.yearsDropdown = undefined;
        }
    }

    private getDaysofMonth(props: CalendarMonthProps): Day[][] {
        const { month, startDate, endDate, minDate, maxDate } = props;
        const currentMonth = getDatesofMonth(month);

        const startDateDisabled = startDate && minDate && !isDayAfter(startDate, minDate);

        return currentMonth.map((week): Day[] =>
            week.map((day): Day => {
                const { date, inCurrentMonth } = day;
                const disabled =
                    !inCurrentMonth ||
                    Boolean(
                        (minDate && isDayBefore(date, minDate)) ||
                            (maxDate && isDayAfter(date, maxDate))
                    );

                return {
                    date,
                    inRange:
                        inCurrentMonth &&
                        !startDateDisabled &&
                        !disabled &&
                        Boolean(
                            startDate &&
                                isDayAfter(date, startDate) &&
                                endDate &&
                                isDayBefore(date, endDate)
                        ),
                    selected:
                        !disabled &&
                        Boolean(
                            (startDate && isSameDay(date, startDate)) ||
                                (endDate && isSameDay(date, endDate))
                        ),
                    disabled,
                    inCurrentMonth
                };
            })
        );
    }

    getDropDowns = (
        props: CalendarMonthProps
    ): [CalendarDropdownProps[], CalendarDropdownProps[]] => {
        const { minDate, maxDate, month } = props;

        const firstDay = startOfMonth(month);
        const today = new Date();
        const minYear = minDate ? minDate.getFullYear() : today.getFullYear() - 50;
        const maxYear = maxDate ? maxDate.getFullYear() + 1 : today.getFullYear() + 5;

        const dropdownMonths: CalendarDropdownProps[] = Array.from({ length: 12 }, (_, i) => ({
            disabled: Boolean(
                (minDate && isDayBefore(setMonth(month, i), minDate)) ||
                    (maxDate && isDayAfter(setMonth(month, i), maxDate))
            ),
            value: i,
            selected: firstDay.getMonth() === i
        }));

        const dropdownYears: CalendarDropdownProps[] = Array.from(
            { length: maxYear - minYear },
            (_, i) => ({
                value: i + minYear,
                disabled: false,
                selected: i + minYear === firstDay.getFullYear()
            })
        );

        return [dropdownMonths, dropdownYears];
    };

    render() {
        const { month, render } = this.props;

        return render({
            days: this.getDaysofMonth(this.props),
            month: startOfMonth(month),
            monthsDropdown: this.monthsDropdown,
            yearsDropdown: this.yearsDropdown
        });
    }
}
