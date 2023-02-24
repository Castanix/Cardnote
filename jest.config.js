/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	transformIgnorePatterns: ['node_modules/(?!@uiw)/'],
	transform: {
		'^.+\\.ts?$': 'ts-jest',
		"^.+\\.(js|jsx)$": "babel-jest"
	},
	moduleNameMapper: {
		'\\.(css|less)$': '<rootDir>/src/tests/mocks/styleMock.ts',
	},
};