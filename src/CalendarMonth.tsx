import * as React from 'react';

import {
    startOfMonth,
    isDayAfter,
    isDayBefore,
    isSameDay,
    setMonth,
    getDatesofMonth
} from './utils';

export interface CalendarMonthRenderProps {
    days: Array<Array<DayOfMonth | null>>;
    month: Date;
    dropdownMonths?: CalendarDropdownProps[];
    dropdownYears?: CalendarDropdownProps[];
}

export interface CalendarDropdownProps {
    value: number;
    selected: boolean;
    disabled: boolean;
}

export interface DayOfMonth {
    date: Date;
    inRange: boolean;
    selected: boolean;
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
     * If set as `true`, shows **month** and **year** dropdowns above the calendar
     */
    showDropdowns?: boolean;
    /**
     *
     */
    render(props: CalendarMonthRenderProps): React.ReactNode;
}

/**
 * A Calendar Month
 *
 * @see examples/SimpleDatePicker.tsx
 */
export class CalendarMonth extends React.Component<CalendarMonthProps> {
    private dropdownMonths?: CalendarDropdownProps[];
    private dropdownYears?: CalendarDropdownProps[];

    constructor(props: CalendarMonthProps) {
        super(props);

        if (props.showDropdowns) {
            const [dropdownMonths, dropdownYears] = this.getDropDowns(props);
            this.dropdownMonths = dropdownMonths;
            this.dropdownYears = dropdownYears;
        }
    }

    componentWillReceiveProps(nextProps: CalendarMonthProps) {
        if (nextProps.showDropdowns) {
            const [dropdownMonths, dropdownYears] = this.getDropDowns(nextProps);
            this.dropdownMonths = dropdownMonths;
            this.dropdownYears = dropdownYears;
        } else {
            this.dropdownMonths = undefined;
            this.dropdownYears = undefined;
        }
    }

    private getDaysofMonth(props: CalendarMonthProps): Array<Array<DayOfMonth | null>> {
        const { month, startDate, endDate, minDate, maxDate } = props;
        const currentMonth = getDatesofMonth(month);

        const startDateDisabled = startDate && minDate && !isDayAfter(startDate, minDate);

        return currentMonth.map((week) =>
            week.map((day) => {
                if (!day) return null;

                const disabled = Boolean(
                    (minDate && isDayBefore(day, minDate)) || (maxDate && isDayAfter(day, maxDate))
                );

                return {
                    date: day,
                    inRange:
                        !startDateDisabled &&
                        !disabled &&
                        Boolean(
                            startDate &&
                                isDayAfter(day, startDate) &&
                                endDate &&
                                isDayBefore(day, endDate)
                        ),
                    selected:
                        !disabled &&
                        Boolean(
                            (startDate && isSameDay(day, startDate)) ||
                                (endDate && isSameDay(day, endDate))
                        ),
                    disabled
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
            dropdownMonths: this.dropdownMonths,
            dropdownYears: this.dropdownYears
        });
    }
}
