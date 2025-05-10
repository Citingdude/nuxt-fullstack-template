import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  ignores: [
    'server/db/migrations',
  ],
  rules: {
    'node/prefer-global/process': 'off',
  },
})
