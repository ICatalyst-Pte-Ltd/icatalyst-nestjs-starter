import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, PrismaClient } from '~prisma/client.js';
import { randomUUID } from 'node:crypto';
import { AbstractPrisma } from './abstract.prisma.js';
import { mockCursorPaginationOptions } from './pagination/entities/cursor-pagination.options.entity.utils.spec.js';
import { PaginationService } from './pagination/pagination.service.js';
import { PrismaService } from './prisma.service.js';
import { DelegateName, FindManyOptions } from './prisma.types.js';

describe(AbstractPrisma.name, () => {
  // TODO: add the delegates of your Prisma models
  const delegates: Array<DelegateName> = ['example'];

  describe.each(
    delegates.map((delegate) => {
      return { delegate };
    }),
  )('$#: $delegate', ({ delegate }) => {
    @Injectable()
    class TestPrisma extends AbstractPrisma<typeof delegate> {
      constructor(moduleRef: ModuleRef) {
        super(delegate, moduleRef);
      }
    }

    let wrapper: TestPrisma;
    let paginationService: PaginationService;
    let prismaService: PrismaService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          TestPrisma,
          { provide: PaginationService, useValue: {} },
          { provide: PrismaService, useValue: { [delegate]: {} } },
        ],
      }).compile();

      wrapper = module.get(TestPrisma);
      paginationService = module.get(PaginationService);
      prismaService = module.get(PrismaService);

      await module.init();
    });

    it('should be defined', () => {
      expect(wrapper).toBeDefined();
      expect(wrapper.delegate).toBe(delegate);
    });

    it(`should throw an exception if ${PaginationService.name} is not initialized`, () => {
      type T = { pagination: PaginationService };
      const testPrisma = new TestPrisma({} as ModuleRef) as unknown as T;

      function toThrow() {
        return testPrisma.pagination;
      }

      expect(toThrow).toThrow(
        new Error(`${PaginationService.name} is not initialized yet`),
      );
    });

    it(`should throw an exception if ${PrismaService.name} is not initialized`, () => {
      type T = { prisma: PrismaService };
      const testPrisma = new TestPrisma({} as ModuleRef) as unknown as T;

      function toThrow() {
        return testPrisma.prisma;
      }

      expect(toThrow).toThrow(
        new Error(`${PrismaService.name} is not initialized yet`),
      );
    });

    describe(AbstractPrisma.prototype.create.name, () => {
      type T = Prisma.Args<PrismaClient[typeof delegate], 'create'>;

      it('should call the PrismaService create() method', async () => {
        const value = { id: randomUUID() };
        prismaService[delegate].create = vi.fn().mockResolvedValue(value);
        const args = { data: { id: randomUUID() } } as T;

        const observable = wrapper.create(args);

        const result = await firstValueFrom(observable);

        expect(result).toBe(value);
        expect(prismaService[delegate].create).toHaveBeenCalledTimes(1);
        expect(prismaService[delegate].create).toHaveBeenCalledWith(args);
      });
    });

    describe(AbstractPrisma.prototype.createMany.name, () => {
      type T = Prisma.Args<PrismaClient[typeof delegate], 'createMany'>;

      it('should call the PrismaService createManyAndReturn()', async () => {
        const value = { id: randomUUID() };
        const mockCreatedRecords = [value, value];
        prismaService[delegate].createManyAndReturn = vi
          .fn()
          .mockResolvedValue(mockCreatedRecords);
        const args = {
          data: [{ id: randomUUID() }, { id: randomUUID() }],
        } as T;

        const observable = wrapper.createMany(args);

        const result = await firstValueFrom(observable);

        expect(result).toEqual(mockCreatedRecords);
        expect(
          prismaService[delegate].createManyAndReturn,
        ).toHaveBeenCalledTimes(1);
        expect(
          prismaService[delegate].createManyAndReturn,
        ).toHaveBeenCalledWith(args);
      });
    });

    describe(AbstractPrisma.prototype.createManyTransaction.name, () => {
      type T = Prisma.Args<PrismaClient[typeof delegate], 'create'>;

      it('should call the PrismaService create() method n times and the $transaction method once', async () => {
        const values = [{ id: randomUUID() }, { id: randomUUID() }];
        const fn = vi.fn();
        values.forEach((value) => {
          fn.mockResolvedValueOnce(value);
        });
        prismaService[delegate].create = fn;
        prismaService.$transaction = vi
          .fn()
          .mockImplementation((promises: ReadonlyArray<Promise<unknown>>) => {
            return Promise.all(promises);
          });
        const args = values.map(() => {
          return { data: { id: randomUUID() } } as T;
        });

        const observable = wrapper.createManyTransaction(args);

        const result = await firstValueFrom(observable);

        expect(result).toEqual(values);
        expect(prismaService[delegate].create).toHaveBeenCalledTimes(
          args.length,
        );
        args.forEach((value, index) => {
          expect(prismaService[delegate].create).toHaveBeenNthCalledWith(
            index + 1,
            value,
          );
        });
        expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
        expect(prismaService.$transaction).toHaveBeenCalledWith(
          args.map(() => {
            return expect.any(Promise);
          }),
        );
      });
    });

    describe(AbstractPrisma.prototype.findMany.name, () => {
      type T = Prisma.Args<PrismaClient[typeof delegate], 'findMany'>;

      it('should call the PrismaService findMany() method', async () => {
        paginationService.buildPaginatedArgs = vi.fn();
        const values = [{ id: randomUUID() }, { id: randomUUID() }];
        prismaService[delegate].findMany = vi.fn().mockResolvedValue(values);
        const args = { where: { id: randomUUID() } } as T;

        const observable = wrapper.findMany(args);

        const result = await firstValueFrom(observable);

        expect(result).toBe(values);
        expect(paginationService.buildPaginatedArgs).not.toHaveBeenCalled();
        expect(prismaService[delegate].findMany).toHaveBeenCalledTimes(1);
        expect(prismaService[delegate].findMany).toHaveBeenCalledWith(args);
      });

      it.each([{ args: { where: { id: randomUUID() } } }, { args: undefined }])(
        '$#: should set the orderBy: args=$args',
        async ({ args }) => {
          const values = [{ id: randomUUID() }, { id: randomUUID() }];
          prismaService[delegate].findMany = vi.fn().mockResolvedValue(values);
          const options = {
            orderBy: [{ id: 'asc' }, { id: 'desc' }],
          } satisfies FindManyOptions;

          const observable = wrapper.findMany(args, options);

          const result = await firstValueFrom(observable);

          expect(result).toEqual(values);
          expect(prismaService[delegate].findMany).toHaveBeenCalledTimes(1);
          expect(prismaService[delegate].findMany).toHaveBeenCalledWith({
            ...args,
            orderBy: options.orderBy,
          });
        },
      );

      it('should call the pagination strategy', async () => {
        const value = { id: randomUUID() };
        paginationService.buildPaginatedArgs = vi.fn().mockReturnValue(value);
        const values = [{ id: randomUUID() }, { id: randomUUID() }];
        prismaService[delegate].findMany = vi.fn().mockResolvedValue(values);
        const args = { where: { id: randomUUID() } };
        const options = {
          pagination: {
            name: 'cursor',
            options: mockCursorPaginationOptions({}),
          },
        } satisfies FindManyOptions;

        const observable = wrapper.findMany(args, options);

        const result = await firstValueFrom(observable);

        expect(result).toEqual(values);
        expect(paginationService.buildPaginatedArgs).toHaveBeenCalledTimes(1);
        expect(paginationService.buildPaginatedArgs).toHaveBeenCalledWith({
          args,
          strategy: options.pagination,
        });
        expect(prismaService[delegate].findMany).toHaveBeenCalledTimes(1);
        expect(prismaService[delegate].findMany).toHaveBeenCalledWith(value);
      });
    });

    describe(AbstractPrisma.prototype.findUnique.name, () => {
      type T = Prisma.Args<PrismaClient[typeof delegate], 'findUnique'>;

      it('should call the PrismaService findUnique() method', async () => {
        const value = { id: randomUUID() };
        prismaService[delegate].findUnique = vi.fn().mockResolvedValue(value);
        const args = { where: { id: randomUUID() } } as T;

        const observable = wrapper.findUnique(args);

        const result = await firstValueFrom(observable);

        expect(result).toBe(value);
        expect(prismaService[delegate].findUnique).toHaveBeenCalledTimes(1);
        expect(prismaService[delegate].findUnique).toHaveBeenCalledWith(args);
      });
    });

    describe(AbstractPrisma.prototype.findUniqueOrThrow.name, () => {
      type T = Prisma.Args<PrismaClient[typeof delegate], 'findUniqueOrThrow'>;

      it('should call the PrismaService findUniqueOrThrow() method', async () => {
        const value = { id: randomUUID() };
        prismaService[delegate].findUniqueOrThrow = vi
          .fn()
          .mockResolvedValue(value);
        const args = { where: { id: randomUUID() } } as T;

        const observable = wrapper.findUniqueOrThrow(args);

        const result = await firstValueFrom(observable);

        expect(result).toBe(value);
        expect(prismaService[delegate].findUniqueOrThrow).toHaveBeenCalledTimes(
          1,
        );
        expect(prismaService[delegate].findUniqueOrThrow).toHaveBeenCalledWith(
          args,
        );
      });
    });

    describe(AbstractPrisma.prototype.update.name, () => {
      type T = Prisma.Args<PrismaClient[typeof delegate], 'update'>;

      it('should call the PrismaService update() method', async () => {
        const value = { id: randomUUID() };
        prismaService[delegate].update = vi.fn().mockResolvedValue(value);
        const args = {
          data: { id: randomUUID() },
          where: { id: randomUUID() },
        } as T;

        const observable = wrapper.update(args);

        const result = await firstValueFrom(observable);

        expect(result).toBe(value);
        expect(prismaService[delegate].update).toHaveBeenCalledTimes(1);
        expect(prismaService[delegate].update).toHaveBeenCalledWith(args);
      });
    });

    describe(AbstractPrisma.prototype.upsert.name, () => {
      type T = Prisma.Args<PrismaClient[typeof delegate], 'upsert'>;

      it('should call the PrismaService upsert() method', async () => {
        const value = { id: randomUUID() };
        prismaService[delegate].upsert = vi.fn().mockResolvedValue(value);
        const args = {
          create: { name: 'name' },
          update: { name: 'new name' },
          where: { id: randomUUID() },
        } as T;

        const observable = wrapper.upsert(args);

        const result = await firstValueFrom(observable);

        expect(result).toBe(value);
        expect(prismaService[delegate].upsert).toHaveBeenCalledTimes(1);
        expect(prismaService[delegate].upsert).toHaveBeenCalledWith(args);
      });
    });

    describe(AbstractPrisma.prototype.delete.name, () => {
      type T = Prisma.Args<PrismaClient[typeof delegate], 'delete'>;

      it('should call the PrismaService delete() method', async () => {
        const value = { id: randomUUID() };
        prismaService[delegate].delete = vi.fn().mockResolvedValue(value);
        const args = { where: { id: randomUUID() } } as T;

        const observable = wrapper.delete(args);

        const result = await firstValueFrom(observable);

        expect(result).toBe(value);
        expect(prismaService[delegate].delete).toHaveBeenCalledTimes(1);
        expect(prismaService[delegate].delete).toHaveBeenCalledWith(args);
      });
    });

    describe(AbstractPrisma.prototype.deleteManyTransaction.name, () => {
      type T = Prisma.Args<PrismaClient[typeof delegate], 'delete'>;

      it('should call the PrismaService delete() method n times and the $transaction method once', async () => {
        const values = [{ id: randomUUID() }, { id: randomUUID() }];
        const fn = vi.fn();
        values.forEach((value) => {
          fn.mockResolvedValueOnce(value);
        });
        prismaService[delegate].delete = fn;
        prismaService.$transaction = vi
          .fn()
          .mockImplementation((promises: ReadonlyArray<Promise<unknown>>) => {
            return Promise.all(promises);
          });
        const args: ReadonlyArray<T> = values.map((value) => ({
          where: { id: value.id },
        })) as ReadonlyArray<T>;

        const observable = wrapper.deleteManyTransaction(args);

        const result = await firstValueFrom(observable);

        expect(result).toEqual(values);
        expect(prismaService[delegate].delete).toHaveBeenCalledTimes(
          args.length,
        );
        args.forEach((value, index) => {
          expect(prismaService[delegate].delete).toHaveBeenNthCalledWith(
            index + 1,
            value,
          );
        });
        expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
        expect(prismaService.$transaction).toHaveBeenCalledWith(
          args.map(() => {
            return expect.any(Promise);
          }),
        );
      });
    });

    describe(AbstractPrisma.prototype.count.name, () => {
      it('should call the PrismaService count() method', async () => {
        const value = { id: randomUUID() };
        prismaService[delegate].count = vi.fn().mockResolvedValue(value);
        const args = { where: { id: randomUUID() } };

        const observable = wrapper.count(args);

        const result = await firstValueFrom(observable);

        expect(result).toBe(value);
        expect(prismaService[delegate].count).toHaveBeenCalledTimes(1);
        expect(prismaService[delegate].count).toHaveBeenCalledWith(args);
      });
    });
  });
});
