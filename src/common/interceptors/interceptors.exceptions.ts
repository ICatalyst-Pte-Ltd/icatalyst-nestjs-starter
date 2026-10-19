import { NotAcceptableException } from '@nestjs/common';

export class VersionNotAcceptableException extends NotAcceptableException {
  constructor() {
    super(
      'Client must request CSV version 2 by sending `Accept: text/csv; version=2`',
    );
  }
}
