# `<DateRangeControl/> `

## PropTypes


| prop | type | optional | description |
| ---- | ---- | -------- | ----------- |
| `onDatesChange` | `(dates: DateRange) => void` | Yes | Callback when start and/or end dates are changed See [DateRange](#daterange) |
| `showThreeMonths` | `boolean` | Yes | By default 2 consecutive months will be shown, but if you want to show 3 months instead, set this to `true` |
| `render` | `(props: DateRangeControlRenderProps) => ReactNode` | No | The main function, which be used for rendering. It is called with an object. See [DateRangeControlRenderProps](#daterangecontrolrenderprops) |
| `startDate` | `Date` | Yes |  |
| `endDate` | `Date` | Yes |  |
| `minDate` | `Date` | Yes |  |
| `maxDate` | `Date` | Yes |  |

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
