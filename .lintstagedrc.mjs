export default {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'pnpm typecheck',
  // Lint then format TypeScript and JavaScript files
  '**/*.(ts|tsx|js)': (files) => [
    `pnpm eslint ${files.join(' ')}`,
    `pnpm prettier -uc ${files.join(' ')}`,
  ],
};
