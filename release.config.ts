import type { GlobalConfig } from 'semantic-release';

const config: GlobalConfig = {
  extends: ['@semantic-release/gitlab-config'],
  branches: ['main'],
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    ['@semantic-release/release-notes-generator', { preset: 'conventionalcommits' }],
    '@semantic-release/gitlab',
  ],
};

export default config;
