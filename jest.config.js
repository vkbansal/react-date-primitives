module.exports = {
    setupFiles: ['<rootDir>/__jest__/jest.setup.js'],
    testMatch: ['**/?(*.)(spec|test).ts?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    roots: ['<rootDir>/src/__tests__/'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest/preprocessor.js'
    },
    snapshotSerializers: ['enzyme-to-json/serializer', '<rootDir>/__jest__/date-serializer'],
    collectCoverageFrom: ['src/*.{ts,tsx}']
};
