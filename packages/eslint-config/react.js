import base from './base';

export default {
  ...base,
  plugins: [...base.plugins, 'react', 'react-hooks'],
  extends: [...base.extends, 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    ...base.settings,
    react: {
      version: 'detect',
    },
  },
};
