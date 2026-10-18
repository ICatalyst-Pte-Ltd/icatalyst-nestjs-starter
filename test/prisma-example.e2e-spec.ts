import { Prisma, Example } from '~prisma';
import { PrismaService } from '../src/common/prisma/prisma.service.js';

// NOTE: this is a example e2e tests for the Example model
describe('Example', () => {
  const prisma = new PrismaService();

  beforeEach(async () => {
    await prisma.example.deleteMany();
  });

  afterAll(async () => {
    await prisma.example.deleteMany();
  });

  it('should create', async () => {
    const data: Prisma.ExampleCreateInput = {};

    const example = await prisma.example.create({ data });

    expect(example).toEqual<Example>({
      id: expect.any(String),
    });
    expect(await prisma.example.count()).toBe(1);
  });
});
