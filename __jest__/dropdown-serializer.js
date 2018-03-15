const seperator = '-'.repeat(10);
module.exports = {
    test: (val) =>
        Array.isArray(val) &&
        Object.keys(val[0]).length === 3 &&
        'selected' in val[0] &&
        'value' in val[0] &&
        'disabled' in val[0],
    print: (val) =>
        `${seperator}\n` +
        val
            .map((d) => {
                let t = '--';
                if (d.seleted) {
                    t[0] = 's';
                }

                if (d.disabled) {
                    t[1] = 'd';
                }

                return `${d.value} (${t})`;
            })
            .join(`\n${seperator}\n`) +
        `\n${seperator}`
};
