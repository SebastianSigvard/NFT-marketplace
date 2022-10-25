module.exports = {
  'env': {
    'es2021': true,
    'node': true,
  },
  'parser': "@babel/eslint-parser",
  'extends': [
    'google',
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    'requireConfigFile': false,
    'babelOptions': {
      plugins: [
        '@babel/plugin-syntax-import-assertions'
      ],
    },
  },
  'rules': {
    'max-len': ['error', {'code': 120}],
    'require-jsdoc': 0,
  },
};
