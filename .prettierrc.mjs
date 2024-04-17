/** @type {import("prettier").Config} */
const config = {
  trailingComma: 'none',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 160,
  endOfLine: 'crlf',
  overrides: [
    {
      files: ['.eslintrc', 'src/__test__/*'],
      options: {
        printWidth: 80
      }
    }
  ]
};

export default config;
