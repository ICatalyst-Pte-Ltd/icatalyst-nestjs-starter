interface Case {
  expected: boolean;
  value: string;
}

export function regExpTests(
  name: string,
  expression: RegExp,
  cases: ReadonlyArray<Case> | (() => ReadonlyArray<Case>),
  isUnicode: boolean,
): void {
  describe(name, () => {
    it(`should have unicode set to ${isUnicode}`, () => {
      expect(expression.unicode).toBe(isUnicode);
    });

    it.each(typeof cases === 'function' ? cases() : cases)(
      '$#: should be $expected if string is "$value"',
      ({ expected, value }) => {
        const result = expression.test(value);

        expect(result).toBe(expected);
      },
    );
  });
}
