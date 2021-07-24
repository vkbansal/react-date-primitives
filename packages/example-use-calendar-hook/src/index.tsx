import * as React from 'react';
import { render } from 'react-dom';

/**
 * Use your favourite date library (eg: moment, date-fns, etc).
 */
import { isSameDay } from 'date-fns';
import { useCalendar } from '@vkbansal/react-date-primitives';

import css from './styles.module.scss';

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
  const { days, month, nextMonth, prevMonth } = useCalendar();
  const [selected, setSelected] = React.useState(new Date());

  const monthName = MONTH_NAMES[month.getMonth()];

  return (
    <div className={css.main}>
      <div className={css.header}>
        <div>
          <button onClick={prevMonth}>&lt;</button>
        </div>
        <div>
          {monthName} {month.getFullYear()}
        </div>
        <div>
          <button onClick={nextMonth}>&gt;</button>
        </div>
      </div>
      <div className={css.dayNames}>
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
            data-active-month={day.inCurrentMonth}
            data-selected={isSameDay(day.dateObj, selected)}
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
