import { HttpStatus, NotAcceptableException } from '@nestjs/common';
import { VersionNotAcceptableException } from './interceptors.exceptions.js';

describe(VersionNotAcceptableException.name, () => {
  it('should be a NotAcceptableException with a message about the CSV version', () => {
    const result = new VersionNotAcceptableException();

    expect(result).toBeInstanceOf(NotAcceptableException);
    expect(result.getStatus()).toBe(HttpStatus.NOT_ACCEPTABLE);
    expect(result.message).toBe(
      'Client must request CSV version 2 by sending `Accept: text/csv; version=2`',
    );
  });
});
