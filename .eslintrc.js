module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    // Ref sugar (take 2)
    $: 'readonly',
    $$: 'readonly',
    $ref: 'readonly',
    $shallowRef: 'readonly',
    $computed: 'readonly',

    // index.d.ts
    // global.d.ts
    Fn: 'readonly',
    PromiseFn: 'readonly',
    RefType: 'readonly',
    LabelValueOptions: 'readonly',
    EmitType: 'readonly',
    TargetContext: 'readonly',
    ComponentElRef: 'readonly',
    ComponentRef: 'readonly',
    ElRef: 'readonly',
    global: 'readonly',
    ForDataType: 'readonly',
    ComponentRoutes: 'readonly',

    // script setup
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 0,
    'no-unused-vars': 0,
    'vue/no-mutating-props': 2,
    // 'no-unused-vars': [
    //   'warn',
    //   {
    //     argsIgnorePattern: '^_',
    //     varsIgnorePattern: '^_'
    //   }
    // ],
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'off', // any
    'no-debugger': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off', // setup()
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ]
  }
}
