import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const OPTIONAL_AUTHENTICATION_KEY = 'AUTHENTICATION:OPTIONAL';

export function OptionalAuthentication(): CustomDecorator<string> {
  return SetMetadata(OPTIONAL_AUTHENTICATION_KEY, true);
}
