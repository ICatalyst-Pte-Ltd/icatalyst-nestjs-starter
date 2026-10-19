/**
 * This regular expression matches a string that is like a SemVer except that the minor and patch numbers are
 * optional.
 */
export const VERSION = /^(0|[1-9]\d*)(\.(0|[1-9]\d*)){0,2}$/;
