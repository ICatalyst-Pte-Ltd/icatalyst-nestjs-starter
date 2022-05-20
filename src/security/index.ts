import { INestApplication } from '@nestjs/common';
import { setSecurityHeaders } from './headers';
import { setCors } from './cors';

export function secure(app: INestApplication) {
  setSecurityHeaders(app);
  setCors(app);
}
