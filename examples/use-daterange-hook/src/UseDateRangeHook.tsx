import * as React from 'react';
import { useDateRange } from 'react-date-primitives';

/**
 * These are internal modules to `react-date-primitives` and are used only for demo purposes only.
 * Please do not use in production. This might break in future without any notice.
 *
 * Use your favourite date library (eg: moment, date-fns, etc.) instead.
 */
import { addMonths } from 'react-date-primitives/esm/utils';

import { Month } from './Month';

function genMonthId(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

export function UseDateRangeHook() {
    const { handleDayClick, handleDayHover, processMonth } = useDateRange();
    const [month, setMonth] = React.useState(new Date());

    function handlePrevClick() {
        setMonth(addMonths(month, -1));
    }

    function handleNextClick() {
        setMonth(addMonths(month, 1));
    }

    return (
        <div style={{ display: 'flex' }}>
            {[month, addMonths(month, 1)].map((month) => (
                <Month
                    key={genMonthId(month)}
                    month={month}
                    processMonth={processMonth}
                    onDayClick={handleDayClick}
                    onDayHover={handleDayHover}
                    onNextClick={handleNextClick}
                    onPrevClick={handlePrevClick}
                />
            ))}
        </div>
    );
}
