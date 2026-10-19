/**
 * This regular expression matches a string that contains only numeric digits (0-9).
 * The string must consist of one or more digits and cannot include any other characters,
 * such as letters, symbols, or whitespace. It also does not allow for a leading sign
 * (positive or negative) or decimal points.
 * For example, "123" and "456789" would match this regular expression, but "123a", "-123",
 * "12.34", and " 123 " would not.
 */
export const BIGINT = /^\d+$/;
