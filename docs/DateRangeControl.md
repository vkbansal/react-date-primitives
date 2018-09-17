# `<DateRangeControl/> `

Controller component for making a date-range picker in conjunction with [CalendarMonth]()

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

### `DateRange`

| prop | type | optional | description |
| ---- | ---- | -------- | ----------- |
| `startDate` | `Date` | No | Starting date of the range |
| `endDate` | `Date` | Yes | End date of the range |


### `DateRangeControlRenderProps`

| prop | type | optional | description |
| ---- | ---- | -------- | ----------- |
| `onDayClick` | `(date: Date) => void` | No | Callback for handling click on a date |
| `onDayHover` | `(date: Date) => void` | No | Callback for handling mouse hover on a date |
| `months` | `Date[]` | No | The months to be shown to the user |
| `moveForward` | `() => void` | No | Callback for moving to next month |
| `moveBackward` | `() => void` | No | Callback for moving to prev month |
