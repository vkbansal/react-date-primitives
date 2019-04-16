import { useState } from 'react';

import { DaysOfMonth, startOfMonth, addMonths, getDaysOfMonth } from '../utils';

export interface Month {
    month: Date;
    days: DaysOfMonth;
}

export interface DateRange {
    months: Month[];
    setDateRange(startDate: Date, endDate?: Date): void;
}

// export function processDates(month: DaysOfMonth) {}

export function useDateRange(initialStartDate: Date = new Date(), initialEndDate?: Date) {
    const [startDate] = useState(initialStartDate);
    const [] = useState(initialEndDate);
    const month = startOfMonth(startDate);

    const months: Month[] = Array.from({ length: 2 }, (_1, i) => {
        const m = addMonths(month, i);
        return {
            month: m,
            days: getDaysOfMonth(m)
        };
    });
    // const [selectionActive] = useState(false);
    // function handleDayClick(day: Date) {
    //     this.setState((state) => {
    //         const { startDate, selectionActive } = state;
    //         let newState: Pick<DateRangeControlProps, 'startDate' | 'endDate'>;
    //         if (startDate && selectionActive && !isDayBefore(day, startDate)) {
    //             newState = {
    //                 startDate,
    //                 endDate: day
    //             };
    //             callIfExists(this.props.onDatesChange, newState);
    //             return {
    //                 selectionActive: false,
    //                 ...newState
    //             };
    //         }
    //         newState = {
    //             startDate: day,
    //             endDate: undefined
    //         };
    //         callIfExists(this.props.onDatesChange, newState);
    //         return {
    //             selectionActive: true,
    //             ...newState
    //         };
    //     });
    // }
    // handleDayHover = (day: Date) => {
    //     const { selectionActive, startDate } = this.state;
    //     if (selectionActive && startDate && !isDayBefore(day, startDate)) {
    //         this.setState(() => ({
    //             endDate: day
    //         }));
    //     }
    // };
    // handleNavigation = (months: number) => () => {
    //     this.setState((state) => {
    //         return {
    //             months: state.months.map((month) => addMonths(month, months))
    //         };
    //     });
    // };

    return { months };
}
