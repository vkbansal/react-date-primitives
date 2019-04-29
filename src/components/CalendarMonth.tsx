import * as React from 'react';

import {
    startOfMonth,
    isDayAfter,
    isDayBefore,
    isSameDay,
    setMonth,
    getDaysOfMonth
} from '../utils';

import { CalendarMonthProps, DayOfMonth, CalendarDropdownOption } from './types';

/**
 * Primitive react component that can be used to make a datepicker.
 */
export class CalendarMonth extends React.Component<CalendarMonthProps> {
    private getDaysofMonth(props: CalendarMonthProps): DayOfMonth[][] {
        const { month, startDate, endDate, minDate, maxDate } = props;
        const currentMonth = getDaysOfMonth(month);

        const startDateDisabled = !!startDate && !!minDate && !isDayAfter(startDate, minDate);

        return currentMonth.map(
            (week): DayOfMonth[] =>
                week.map(
                    (day): DayOfMonth => {
                        const { date, inCurrentMonth } = day;
                        const disabled =
                            !inCurrentMonth ||
                            Boolean(
                                (minDate && isDayBefore(date, minDate)) ||
                                    (maxDate && isDayAfter(date, maxDate))
                            );

                        const selected =
                            !disabled &&
                            Boolean(
                                (startDate && isSameDay(date, startDate)) ||
                                    (endDate && isSameDay(date, endDate))
                            );

                        const inRange = Boolean(
                            startDate &&
                                isDayAfter(date, startDate) &&
                                endDate &&
                                isDayBefore(date, endDate)
                        );

                        return {
                            date,
                            inRange:
                                inCurrentMonth &&
                                !startDateDisabled &&
                                !disabled &&
                                (selected || inRange),
                            selected,
                            disabled,
                            inCurrentMonth
                        };
                    }
                )
        );
    }

    private getDropdowns = (
        props: CalendarMonthProps
    ): [CalendarDropdownOption[], CalendarDropdownOption[]] => {
        const { minDate, maxDate, month } = props;

        const firstDay = startOfMonth(month);
        const today = new Date();
        const minYear = minDate ? minDate.getFullYear() : today.getFullYear() - 50;
        const maxYear = maxDate ? maxDate.getFullYear() + 1 : today.getFullYear() + 5;

        const dropdownMonths: CalendarDropdownOption[] = Array.from({ length: 12 }, (_, i) => ({
            disabled: Boolean(
                (minDate && isDayBefore(setMonth(month, i), minDate)) ||
                    (maxDate && isDayAfter(setMonth(month, i), maxDate))
            ),
            value: i,
            selected: firstDay.getMonth() === i
        }));

        const dropdownYears: CalendarDropdownOption[] = Array.from(
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
        const { month, render, showDropdowns } = this.props;

        let monthsDropdown: CalendarDropdownOption[] | undefined;
        let yearsDropdown: CalendarDropdownOption[] | undefined;

        if (showDropdowns) {
            [monthsDropdown, yearsDropdown] = this.getDropdowns(this.props);
        }

        return render({
            days: this.getDaysofMonth(this.props),
            month: startOfMonth(month),
            monthsDropdown,
            yearsDropdown
        });
    }
}
