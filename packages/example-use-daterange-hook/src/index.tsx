import * as React from 'react';
import { render } from 'react-dom';

/**
 * Use your favourite date library (eg: moment, date-fns, etc).
 */
import { addMonths } from 'date-fns';
import type { RangeMonth, DateRange } from '@vkbansal/react-date-primitives';
import { useDateRange } from '@vkbansal/react-date-primitives';

import css from './styles.module.scss';

function UseDateRangeHookExample(): React.ReactElement {
  const { months, range, setRange } = useDateRange([new Date(), addMonths(new Date(), 1)]);
  const [isSelectionActive, setSelectionActive] = React.useState(false);

  return (
    <React.Fragment>
      <div className={css.rangeWrapper}>
        {months.map((rangeMonth, i) => (
          <Month
            key={i}
            rangeMonth={rangeMonth}
            setRange={setRange}
            range={range}
            isSelectionActive={isSelectionActive}
            setSelectionActive={setSelectionActive}
          />
        ))}
      </div>
      <div style={{ marginTop: '1rem' }}>
        Selected Date: {range[0]?.toLocaleDateString()} - {range[1]?.toLocaleDateString()}
      </div>
    </React.Fragment>
  );
}

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

interface MonthProps {
  rangeMonth: RangeMonth;
  setRange(range: DateRange): void;
  range: DateRange;
  isSelectionActive: boolean;
  setSelectionActive(status: boolean): void;
}

function Month(props: MonthProps): React.ReactElement {
  const { rangeMonth, range, setRange, isSelectionActive, setSelectionActive } = props;
  const { days, month } = rangeMonth;
  const [startDate] = range;
  const monthName = MONTH_NAMES[month.getMonth()];

  return (
    <div className={css.month}>
      <div className={css.header}>
        {monthName} {month.getFullYear()}
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
      <div className={css.days}>
        {days.map((day, i) => (
          <div
            data-active-month={day.inCurrentMonth}
            data-inrange={day.inRange}
            data-start={day.isStart}
            data-end={day.isEnd}
            className={css.cell}
            key={i}
            onClick={(): void => {
              if (startDate && isSelectionActive) {
                setRange([startDate, day.dateObj]);
                setSelectionActive(false);
              } else {
                setRange([day.dateObj, null]);
                setSelectionActive(true);
              }
            }}
            onMouseEnter={() => {
              if (startDate && isSelectionActive) {
                setRange([startDate, day.dateObj]);
              }
            }}
          >
            {day.dateObj.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}

render(<UseDateRangeHookExample />, document.getElementById('root'));
