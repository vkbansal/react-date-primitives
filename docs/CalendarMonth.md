# `<CalendarMonth/>`

Primitive react component that can be used to make a datepicker.

## PropTypes


| prop | type | optional | description |
| ---- | ---- | -------- | ----------- |
| `month` | `Date` | No | Current month to be shown |
| `startDate` | `Date` | Yes | The initially selected date when using as a single date-picker. The start of the initially selected date range when used as a daterange-picker. |
| `endDate` | `Date` | Yes | The end of the initially selected date range (only required when used as a daterange-picker) |
| `minDate` | `Date` | Yes | The earliest date a user may select |
| `maxDate` | `Date` | Yes | The latest date a user may select |
| `showDropdowns` | `boolean` | Yes | If set as `true`, then `monthsDropdown` and `yearsDropdown` are populated in the argument given to `render` prop. |
| `render` | `(props: CalendarMonthRenderProps) => ReactNode` | No | The main function, which be used for rendering. See [CalendarMonthRenderProps](#calendarmonthrenderprops) |
### `CalendarMonthRenderProps`

| prop | type | optional | description |
| ---- | ---- | -------- | ----------- |
| `days` | `DayOfMonth[][]` | No | Days of current month. See [DayOfMonth](#dayofmonth) |
| `month` | `Date` | No | Current month. |
| `monthsDropdown` | `CalendarDropdownOption[]` | Yes | Values for creating month dropdown. Months start from `0`, similar to [`Date.proptotype.getMonth()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth). By default, this value is `undefined`. To populate it, set `showDropdowns` prop as `true`. See [CalendarDropdownOption](#calendardropdownoption) |
| `yearsDropdown` | `CalendarDropdownOption[]` | Yes | Values for creating year dropdown. By default, this value is `undefined`. To populate it, set `showDropdowns` prop as `true`. See [CalendarDropdownOption](#calendardropdownoption) |


### `DayOfMonth`

| prop | type | optional | description |
| ---- | ---- | -------- | ----------- |
| `date` | `Date` | No | The date |
| `inCurrentMonth` | `boolean` | No | Is the `date` in current month? |
| `inRange` | `boolean` | No | Is the `date` between `startDate` and `endDate`? By default this value is `false`. This will be populated correctly only when both `startDate` and `endDate` are defined and are valid. |
| `selected` | `boolean` | No | Is the date selected? |
| `disabled` | `boolean` | No | Is the date disabled? By default this value is `false`. It will be `true` for all the dates before `minDate` and after `maxDate`. |


### `CalendarDropdownOption`

| prop | type | optional | description |
| ---- | ---- | -------- | ----------- |
| `value` | `number` | No | Value of the dropdown |
| `selected` | `boolean` | No | Is the value selected? |
| `disabled` | `boolean` | No | Is the value disabled? |
