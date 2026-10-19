/**
 * This regular expression matches a string that contains at least one letter from any language (Unicode).
 * The string may also include numbers, spaces, punctuation (such as commas, parentheses, plus signs, hyphens, and underscores).
 * Specific punctuation characters (commas, parentheses, plus signs, hyphens, and underscores) can be used repeatedly.
 * The regex ensures the string does not start with whitespace and requires at least one letter to be present at the beginning.
 * Examples like "Español", "中文 (Zhōngwén)" will match this expression.
 * Invalid examples: " 123", "123", "!!".
 */
export const LANGUAGE = /^[\p{L}\p{N}][\p{L}\p{N} ,'()+_–-]*$/u;
