module.exports = {
    test: (val) => val instanceof Date,
    print: (val) => val.toLocaleDateString('en-US-u-ca-iso8601', {})
};
