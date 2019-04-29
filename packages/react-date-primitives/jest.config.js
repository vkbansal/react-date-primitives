module.exports = {
    setupFiles: ['<rootDir>/jest.setup.js'],
    testMatch: ['**/?(*.)(spec|test).ts?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    roots: ['<rootDir>/__tests__/'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    collectCoverageFrom: ['src/*.{ts,tsx}']
};
