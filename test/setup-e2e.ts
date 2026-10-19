import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

// Unlike src/common/config/load-environment.ts, load .env even though Vitest sets
// NODE_ENV=test. Variables already set (CI, DATABASE_NAME from scripts/test-e2e)
// take precedence over .env and are used when expanding ${VAR} references.
expand(config({ quiet: true }));
