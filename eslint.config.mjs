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

      // ── Qualidade de Código ──────────────────────────────────────

      // Proibir catches vazios — todo catch deve ter tratamento
      'no-empty': 'error',

      // Proibir console.log em código de produção (permite warn/error)
      'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],

      // Evitar vars não utilizadas (warn para não quebrar legado)
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],

      // Preferir const onde possível
      'prefer-const': 'error',
    },
  },
];

export default config;
