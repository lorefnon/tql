const pack = require("./package");

module.exports = {
  preset: "ts-jest",
  displayName: pack.name,
  testEnvironment: "node",
  prettierPath: null,
  moduleDirectories: ["node_modules", "src", "__tests__"],
  testPathIgnorePatterns: ["build"],
  testRegex: "(/(__tests__|src)/.*(\\.|/)(test|spec))\\.(ts|tsx)$",
  moduleDirectories: ["node_modules", "src", "__tests__"],
};
