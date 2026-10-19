/**
 * This regular expression matches a string that starts and ends with alphanumeric, ,
 * contains only alphanumeric, underscores, hyphens and spaces
 */
export const FILE_PATH = /^(?!_)\w(?:[+ \w-])*(?!_)\w$/;
