import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DEFAULT_PATH } from './constants.js';
import { FILE_PATH } from '../regex/index.js';

@ValidatorConstraint({ async: false })
export class IsValidPathConstraint implements ValidatorConstraintInterface {
  validate(path: string): boolean {
    if (path == '/') {
      return true;
    }
    // Custom validation logic: Replace all '/' with empty string and validate
    const cleanedPath = path.replaceAll(DEFAULT_PATH, '');
    if (!cleanedPath || cleanedPath.length < 4) {
      return false;
    }

    // Regex pattern: starts and ends with alphanumeric, contains only alphanumeric, underscores, and hyphens
    const regexPattern = FILE_PATH;
    return regexPattern.test(cleanedPath);
  }

  defaultMessage(): string {
    return 'Path ($value) is not valid!';
  }
}
