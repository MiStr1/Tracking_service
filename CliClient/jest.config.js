module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/node_modules/$1",
  },
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  testTimeout: 90000
};