import { SetMetadata } from '@nestjs/common';
import {
  OPTIONAL_AUTHENTICATION_KEY,
  OptionalAuthentication,
} from './optional-authentication.decorator.js';

vi.mock(import('@nestjs/common'), async (importOriginal) => ({
  ...(await importOriginal()),
  SetMetadata: vi.fn().mockReturnValue('Custom Decorator'),
}));

describe(OptionalAuthentication.name, () => {
  it('should call SetMetadata with the correct key and value', () => {
    const decorator = OptionalAuthentication();

    expect(decorator).toBe('Custom Decorator');
    expect(SetMetadata).toHaveBeenCalledWith(OPTIONAL_AUTHENTICATION_KEY, true);
  });
});
