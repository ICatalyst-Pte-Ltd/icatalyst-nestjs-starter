/**
 * This regular expression matches a string that starts with one or more lowercase letters,
 * followed by an underscore and one or more lowercase letters, repeated at least two times.
 * For example, "hello_world_foo_bar" would match this regular expression, but "hello_world" would not.
 */
export const CODE = /^[a-z]+(_[a-z]+){2,}$/;
