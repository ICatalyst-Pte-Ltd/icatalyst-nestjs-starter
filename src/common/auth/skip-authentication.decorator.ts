import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const SKIP_AUTHENTICATION_KEY = 'AUTHENTICATION:SKIP';

export function SkipAuthentication(): CustomDecorator<string> {
  return SetMetadata(SKIP_AUTHENTICATION_KEY, true);
}
