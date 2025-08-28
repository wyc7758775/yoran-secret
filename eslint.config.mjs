import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  ignores: [
    '**/*.d.ts',
    '**/dist/**',
    '**/node_modules/**',
  ],
})
