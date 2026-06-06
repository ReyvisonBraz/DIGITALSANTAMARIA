import next from "eslint-config-next";

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**'],
  },
  ...next,
  {
    rules: {
      'import/no-anonymous-default-export': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/use-memo': 'off',
    },
  },
];

export default config;
