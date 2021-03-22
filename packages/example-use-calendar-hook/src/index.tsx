import * as React from 'react';
import { render } from 'react-dom';

/**
 * Use your favourite date library (eg: moment, date-fns, etc).
 */
import { addMonths, isSameDay } from 'date-fns/esm';
import { useCalendar } from '@vkbansal/react-date-primitives';

import css from './styles.module.css';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

function UseCalendarHooksExample(): React.ReactElement {
  const { days, setMonth, month } = useCalendar();
  const [selected, setSelected] = React.useState(new Date());

  function handleMonthIncrement(): void {
    setMonth(addMonths(month, 1));
  }

  function handleMonthDecrement(): void {
    setMonth(addMonths(month, -1));
  }

  const monthName = MONTH_NAMES[month.getMonth()];

  return (
    <div className={css.main}>
      <div>
        <div>
          <button onClick={handleMonthDecrement}>&lt;</button>
        </div>
        <div>
          {monthName} {month.getFullYear()}
        </div>
        <div>
          <button onClick={handleMonthIncrement}>&gt;</button>
        </div>
      </div>
      <div className={css.row}>
        <div className={css.cell}>Sun</div>
        <div className={css.cell}>Mon</div>
        <div className={css.cell}>Tue</div>
        <div className={css.cell}>Wed</div>
        <div className={css.cell}>Thu</div>
        <div className={css.cell}>Fri</div>
        <div className={css.cell}>Sat</div>
      </div>
      <div className={`${css.month} ${css.row}`}>
        {days.map((day, i) => (
          <div
            style={{
              opacity: day.inCurrentMonth ? 1 : 0.2,
              background: isSameDay(day.dateObj, selected) ? '#ccc' : 'transparent'
            }}
            className={css.cell}
            key={i}
            onClick={(): void => {
              day.inCurrentMonth && setSelected(day.dateObj);
            }}
          >
            {day.dateObj.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}

render(<UseCalendarHooksExample />, document.getElementById('root'));
