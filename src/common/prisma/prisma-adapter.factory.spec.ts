import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaAdapterFactory } from './prisma-adapter.factory.js';

vi.mock('@prisma/adapter-pg', () => ({
  PrismaPg: vi.fn(),
}));

describe(PrismaAdapterFactory.name, () => {
  const connectionString =
    'postgresql://nestjs:password@localhost:5432/nestjs?schema=public';

  beforeEach(() => {
    vi.mocked(PrismaPg).mockReset();
  });

  it('should instantiate the adapter class with constructor parameters', () => {
    const adapter = {
      adapterName: '@prisma/adapter-pg',
      provider: 'postgres',
    };
    vi.mocked(PrismaPg).mockImplementation(function () {
      return adapter as unknown as PrismaPg;
    });

    const factory = new PrismaAdapterFactory();
    const result = factory.create(PrismaPg, { connectionString });

    expect(PrismaPg).toHaveBeenCalledWith({ connectionString });
    expect(result).toBe(adapter);
  });
});
