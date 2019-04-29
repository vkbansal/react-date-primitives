module.exports = {
    setupFiles: ['<rootDir>/.jest/jest.setup.js'],
    testMatch: ['**/?(*.)(spec|test).ts?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    roots: ['<rootDir>/__tests__/'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    snapshotSerializers: ['enzyme-to-json/serializer', '<rootDir>/.jest/calendar-serializer', '<rootDir>/.jest/dropdown-serializer'],
    collectCoverageFrom: ['src/*.{ts,tsx}']
};
