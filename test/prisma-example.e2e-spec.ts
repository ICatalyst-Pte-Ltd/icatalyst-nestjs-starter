import { Prisma, Example } from '~prisma';
import { PrismaAdapterFactory } from '../src/common/prisma/prisma-adapter.factory.js';
import { PrismaConfig } from '../src/common/prisma/prisma.config.js';
import { PrismaService } from '../src/common/prisma/prisma.service.js';

// NOTE: this is a example e2e tests for the Example model
describe('Example', () => {
  const prisma = new PrismaService(
    new PrismaConfig(),
    new PrismaAdapterFactory(),
  );

  beforeEach(async () => {
    await prisma.example.deleteMany();
  });

  afterAll(async () => {
    await prisma.example.deleteMany();
    await prisma.$disconnect();
  });

  it('should create', async () => {
    const data: Prisma.ExampleCreateInput = {};

    const example = await prisma.example.create({ data });

    expect(example).toEqual<Example>({
      createdAt: expect.any(Date),
      id: expect.any(String),
      updatedAt: expect.any(Date),
    });
    expect(await prisma.example.count()).toBe(1);
  });
});
