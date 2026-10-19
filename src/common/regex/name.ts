/**
 * This regular expression matches a string that starts and ends with either a letter or number and in between
 * can contain letters or numbers and the following special characters: spaces, pluses, underscores, or dashes.
 * The letters and numbers can be any language as indicated by the 'u' (Unicode) flag after the '/' at the end.
 * For example, "Hello world+123" would match this regular expression, but "+Hello world" would not.
 */
export const NAME =
  /^(?=[\p{L}\p{N}])[\p{L}\p{N} \\(\\)&+_-]+(?<=[\p{L}\p{N}\\)])$/u;
