// tslint:disable:max-line-length
/**
 * A Day of the month
 */
export interface DayOfMonth {
    /**
     * The date
     */
    date: Date;
    /**
     * Is the `date` in current month?
     */
    inCurrentMonth: boolean;
    /**
     * Is the `date` between `startDate` and `endDate`?
     * By default this value is `false`.
     * This will be populated correctly only when both `startDate` and `endDate` are defined and are valid.
     */
    inRange: boolean;
    /**
     * Is the date selected?
     */
    selected: boolean;
    /**
     * Is the date disabled?
     * By default this value is `false`.
     * It will be `true` for all the dates before `minDate` and after `maxDate`.
     */
    disabled: boolean;
}

/**
 * Dropdown option
 */
export interface CalendarDropdownOption {
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
 * CalendarMonth `render` prop is called with this object
 */
export interface CalendarMonthRenderProps {
    /**
     * Days of current month.
     *
     * @see DayOfMonth
     */
    days: DayOfMonth[][];
    /**
     * Current month.
     */
    month: Date;
    /**
     * Values for creating month dropdown.
     * Months start from `0`, similar to [`Date.proptotype.getMonth()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth).
     * By default, this value is `undefined`. To populate it, set `showDropdowns` prop as `true`.
     *
     * @see CalendarDropdownOption
     */
    monthsDropdown?: CalendarDropdownOption[];
    /**
     * Values for creating year dropdown.
     * By default, this value is `undefined`. To populate it, set `showDropdowns` prop as `true`.
     *
     * @see CalendarDropdownOption
     */
    yearsDropdown?: CalendarDropdownOption[];
}

/**
 * Props required by <CalendarMonth /> component
 */
export interface CalendarMonthProps {
    /**
     * Current month to be shown
     */
    month: Date;
    /**
     * The initially selected date when using as a single date-picker.
     * The start of the initially selected date range when used as a daterange-picker.
     */
    startDate?: Date;
    /**
     * The end of the initially selected date range (only required when used as a daterange-picker)
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
     * If set as `true`, then `monthsDropdown` and `yearsDropdown` are populated in the argument given to `render` prop.
     */
    showDropdowns?: boolean;
    /**
     * The main function, which be used for rendering.
     *
     * @see CalendarMonthRenderProps
     */
    render(props: CalendarMonthRenderProps): React.ReactNode;
}

/**
 * A date range
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
 *
 * @extends PickedCalendarMonthProps
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

/**
 * @extends PickedCalendarMonthProps
 */
export interface DateRangeControlProps extends PickedCalendarMonthProps {
    /**
     * Callback when start and/or end dates are changed
     *
     * @see DateRange
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
 * @private
 */
export type DayOfMonthSubset = Pick<DayOfMonth, 'date' | 'inCurrentMonth'>;
