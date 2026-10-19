import { TransformFnParams } from 'class-transformer';
import { randomUUID } from 'node:crypto';
import { clean } from '../sanitize/index.js';
import { cleanValue } from './transform-clean.js';

vi.mock('../sanitize/index.js', () => ({ clean: vi.fn() }));

describe(cleanValue.name, () => {
  it('should call the clean() function', () => {
    const value = randomUUID();
    vi.mocked(clean).mockReturnValue(value);
    const params = { value: randomUUID() } as TransformFnParams;

    const result = cleanValue(params);

    expect(result).toEqual(value);
    expect(clean).toHaveBeenCalledWith(params.value);
  });
});
