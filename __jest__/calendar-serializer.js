// @ts-check
const weekSeperator = '-'.repeat(78);

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

function getSpace(n) {
    return ' '.repeat(n);
}

// The snapshot will look for`Array<Array<Date | null>>` and `Array<Array<Date | null>>`
module.exports = {
    test: (val) =>
        Array.isArray(val) && Array.isArray(val[0]) && val.length === 6 && val[0].length === 7,
    /**
     * @param {Array<Array<Date | null>> | Array<Array<DayOfMonth | null>>} val
     */
    print: (val) => {
        /** @type {Date} */
        let firstDay = val[0].find(
            /**
             * @param {Date | DayOfMonth} day
             */
            (day) => {
                const d = day.date || day;
                return d instanceof Date;
            }
        );
        firstDay = firstDay.date || firstDay;

        const m = `${MONTH_NAMES[firstDay.getMonth()]} ${firstDay.getFullYear()}`;
        const sl = Math.floor((76 - m.length) / 2);

        return (
            `${weekSeperator}\n` +
            `|${getSpace(sl)}${m}${getSpace(76 - sl - m.length)}|\n` +
            `${weekSeperator}\n` +
            val
                .map((week) => {
                    return (
                        '|' +
                        week
                            .map((day) => {
                                if (!day) return getSpace(10);

                                let t = '---';

                                if (day.date) {
                                    if (day.selected) t[0] = 's';
                                    if (day.inRange) t[1] = 'r';
                                    if (day.disabled) t[2] = 'd';
                                }

                                const d = day.date || day;

                                const date = d
                                    .toLocaleDateString('en-US-u-ca-iso8601')
                                    .split('/')[1];

                                return ' ' + `0${date}`.slice(-2) + ` (${t}) `;
                            })
                            .join('|') +
                        '|'
                    );
                })
                .join(`\n${weekSeperator}\n`) +
            '\n' +
            weekSeperator
        );
    }
};
