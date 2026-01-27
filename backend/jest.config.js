export const testEnvironment = 'node';
export const transform = {
    '^.+\\.js$': 'babel-jest'
};
export const transformIgnorePatterns = [
    'node_modules/(?!(your-es6-dependencies)/)'
];