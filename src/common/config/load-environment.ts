import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

if (process.env.NODE_ENV !== 'test') {
  // interpolate references like CACHE_URL=redis://${REDIS_HOST}:${REDIS_PORT} correctly.
  expand(config());
}
