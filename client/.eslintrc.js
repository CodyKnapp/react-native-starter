module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ["*"],
      rules: {
        quotes: ["error", "single"],
        "comma-dangle": ["error", "always-multiline"],
        "object-curly-spacing": ["error", "always"],
        "indent": ["error", 2],
        'prettier/prettier': 0,
      }
    }
  ]
};