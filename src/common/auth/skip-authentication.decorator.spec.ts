import { SetMetadata } from '@nestjs/common';
import {
  SKIP_AUTHENTICATION_KEY,
  SkipAuthentication,
} from './skip-authentication.decorator.js';

vi.mock(import('@nestjs/common'), async (importOriginal) => ({
  ...(await importOriginal()),
  SetMetadata: vi.fn().mockReturnValue('Custom Decorator'),
}));

describe(SkipAuthentication.name, () => {
  it('should call SetMetadata with the correct key and value', () => {
    const decorator = SkipAuthentication();

    expect(decorator).toBe('Custom Decorator');
    expect(SetMetadata).toHaveBeenCalledWith(SKIP_AUTHENTICATION_KEY, true);
  });
});
