import { defineConfig } from 'lint-staged/config';

export default defineConfig({
  '*.{js,jsx,ts,tsx}': ['oxlint --fix', 'prettier --write'],
  '*.{graphql,json,md,yaml,yml}': ['prettier --write'],
  '*.prisma': ['prisma format --schema'],
});
