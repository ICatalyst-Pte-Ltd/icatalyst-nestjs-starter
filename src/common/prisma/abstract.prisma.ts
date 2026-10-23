import { Logger, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Prisma, PrismaClient } from '~prisma/client.js';
import { from, Observable, tap } from 'rxjs';
import { PaginationService } from './pagination/pagination.service.js';
import { PrismaService } from './prisma.service.js';
import { DelegateName, FindMany, FindManyOptions } from './prisma.types.js';

export abstract class AbstractPrisma<
  Delegate extends DelegateName,
> implements OnModuleInit {
  readonly #logger = new Logger(AbstractPrisma.name);
  #pagination!: PaginationService;
  #prisma!: PrismaService;

  constructor(
    public readonly delegate: Delegate,
    private readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit(): void {
    this.#pagination = this.moduleRef.get(PaginationService, { strict: false });
    this.#prisma = this.moduleRef.get(PrismaService, { strict: false });
  }

  create<
    A extends Prisma.Args<PrismaClient[Delegate], 'create'>,
    R extends Prisma.Result<PrismaClient[Delegate], A, 'create'>,
  >(args: A): Observable<R> {
    const observable = from(
      // TODO: remove explicit casting because the type of 'create' is not
      //  correctly inferred as a method but a property
      (
        this.prisma[this.delegate] as unknown as {
          create(args: A): Prisma.PrismaPromise<R>;
        }
      ).create(args),
    );
    return observable.pipe(
      tap((record) => {
        this.#logger.debug({
          method: this.create.name,
          model: this.delegate,
          record,
        });
      }),
    );
  }

  createMany<
    A extends Prisma.Args<PrismaClient[Delegate], 'createManyAndReturn'>,
    R extends Prisma.Result<PrismaClient[Delegate], A, 'createManyAndReturn'>,
  >(args: A): Observable<R> {
    const observable = from(
      // TODO: remove explicit casting because the type of 'createManyAndReturn' is not
      //  correctly inferred as a method but a property
      (
        this.prisma[this.delegate] as unknown as {
          createManyAndReturn(args: A): Prisma.PrismaPromise<R>;
        }
      ).createManyAndReturn(args),
    );

    return observable.pipe(
      tap((records) => {
        this.#logger.debug({
          method: this.createMany.name,
          model: this.delegate,
          records,
        });
      }),
    );
  }

  createManyTransaction<
    A extends Prisma.Args<PrismaClient[Delegate], 'create'>,
    R extends Prisma.Result<PrismaClient[Delegate], A, 'create'>,
  >(argsArray: ReadonlyArray<A>): Observable<ReadonlyArray<R>> {
    const arg = argsArray.map((args) => {
      // TODO: remove explicit casting because the type of 'create' is not
      //  correctly inferred as a method but a property
      return (
        this.prisma[this.delegate] as unknown as {
          create(args: A): Prisma.PrismaPromise<R>;
        }
      ).create(args);
    });
    const promise = this.prisma.$transaction(arg);
    return from(promise).pipe(
      tap((record) => {
        this.#logger.debug({
          method: this.createManyTransaction.name,
          model: this.delegate,
          record,
        });
      }),
    );
  }

  findMany<
    A extends Prisma.Args<PrismaClient[Delegate], FindMany>,
    R extends Prisma.Result<PrismaClient[Delegate], A, FindMany>,
  >(args?: A, options?: FindManyOptions): Observable<R> {
    this.#logger.debug({ method: this.findMany.name, args, options });
    if (options?.orderBy) {
      args = this.buildOrderByArgs({ args, orderBy: options.orderBy });
    }
    if (options?.pagination) {
      args = this.pagination.buildPaginatedArgs({
        args,
        strategy: options.pagination,
      });
    }
    this.#logger.debug({ method: this.findMany.name, args });
    // TODO: remove explicit casting because the type of 'findMany' is not
    //  correctly inferred as a method but a property
    type H = { findMany: (args?: A) => Prisma.PrismaPromise<R> };
    const observable = from(
      (this.prisma[this.delegate] as unknown as H).findMany(args),
    );
    return observable.pipe(
      tap((record) => {
        this.#logger.debug({
          method: this.findMany.name,
          model: this.delegate,
          record,
        });
      }),
    );
  }

  findUnique<
    A extends Prisma.Args<PrismaClient[Delegate], 'findUnique'>,
    R extends Prisma.Result<PrismaClient[Delegate], A, 'findUnique'>,
  >(args: A): Observable<R> {
    const observable = from(
      // TODO: remove explicit casting because the type of 'findUnique' is not
      //  correctly inferred as a method but a property
      (
        this.prisma[this.delegate] as unknown as {
          findUnique(args: A): Prisma.PrismaPromise<R>;
        }
      ).findUnique(args),
    );
    return observable.pipe(
      tap((record) => {
        this.#logger.debug({
          method: this.findUnique.name,
          model: this.delegate,
          record,
        });
      }),
    );
  }

  findUniqueOrThrow<
    A extends Prisma.Args<PrismaClient[Delegate], 'findUniqueOrThrow'>,
    R extends Prisma.Result<PrismaClient[Delegate], A, 'findUniqueOrThrow'>,
  >(args: A): Observable<R> {
    const observable = from(
      // TODO: remove explicit casting because the type of 'findUniqueOrThrow' is not
      //  correctly inferred as a method but a property
      (
        this.prisma[this.delegate] as unknown as {
          findUniqueOrThrow(args: A): Prisma.PrismaPromise<R>;
        }
      ).findUniqueOrThrow(args),
    );
    return observable.pipe(
      tap((record) => {
        this.#logger.debug({
          method: this.findUniqueOrThrow.name,
          model: this.delegate,
          record,
        });
      }),
    );
  }

  update<
    A extends Prisma.Args<PrismaClient[Delegate], 'update'>,
    R extends Prisma.Result<PrismaClient[Delegate], A, 'update'>,
  >(args: A): Observable<R> {
    const observable = from(
      // TODO: remove explicit casting because the type of 'update' is not
      //  correctly inferred as a method but a property
      (
        this.prisma[this.delegate] as unknown as {
          update(args: A): Prisma.PrismaPromise<R>;
        }
      ).update(args),
    );
    return observable.pipe(
      tap((record) => {
        this.#logger.debug({
          method: this.update.name,
          model: this.delegate,
          record,
        });
      }),
    );
  }

  upsert<
    A extends Prisma.Args<PrismaClient[Delegate], 'upsert'>,
    R extends Prisma.Result<PrismaClient[Delegate], A, 'upsert'>,
  >(args: A): Observable<R> {
    const observable = from(
      // TODO: remove explicit casting because the type of 'upsert' is not
      //  correctly inferred as a method but a property
      (
        this.prisma[this.delegate] as unknown as {
          upsert(args: A): Prisma.PrismaPromise<R>;
        }
      ).upsert(args),
    );
    return observable.pipe(
      tap((record) => {
        this.#logger.debug({
          method: this.upsert.name,
          model: this.delegate,
          record,
        });
      }),
    );
  }

  delete<
    A extends Prisma.Args<PrismaClient[Delegate], 'delete'>,
    R extends Prisma.Result<PrismaClient[Delegate], A, 'delete'>,
  >(args: A): Observable<R> {
    const observable = from(
      // TODO: remove explicit casting because the type of 'delete' is not
      //  correctly inferred as a method but a property
      (
        this.prisma[this.delegate] as unknown as {
          delete(args: A): Prisma.PrismaPromise<R>;
        }
      ).delete(args),
    );
    return observable.pipe(
      tap((record) => {
        this.#logger.debug({
          method: this.delete.name,
          model: this.delegate,
          record,
        });
      }),
    );
  }

  deleteManyTransaction<
    A extends Prisma.Args<PrismaClient[Delegate], 'delete'>,
    R extends Prisma.Result<PrismaClient[Delegate], A, 'delete'>,
  >(argsArray: ReadonlyArray<A>): Observable<ReadonlyArray<R>> {
    const arg = argsArray.map((args) => {
      // TODO: remove explicit casting because the type of 'delete' is not
      //  correctly inferred as a method but a property
      return (
        this.prisma[this.delegate] as unknown as {
          delete(args: A): Prisma.PrismaPromise<R>;
        }
      ).delete(args);
    });
    // Prisma delete many only returns the count hence prisma.$transaction is used
    // to delete one record at a time
    const promise = this.prisma.$transaction(arg);
    return from(promise).pipe(
      tap((record) => {
        this.#logger.debug({
          method: this.deleteManyTransaction.name,
          model: this.delegate,
          record,
        });
      }),
    );
  }

  count<
    A extends Prisma.Args<PrismaClient[Delegate], 'count'>,
    R extends Prisma.Result<PrismaClient[Delegate], A, 'count'>,
  >(args?: A): Observable<R> {
    const observable = from(
      // TODO: remove explicit casting because the type of 'delete' is not
      //  correctly inferred as a method but a property
      (
        this.prisma[this.delegate] as unknown as {
          count(args?: A): Prisma.PrismaPromise<R>;
        }
      ).count(args),
    );
    return observable.pipe(
      tap((count) => {
        this.#logger.debug({
          method: this.count.name,
          model: this.delegate,
          count,
        });
      }),
    );
  }

  protected get pagination(): PaginationService {
    if (this.#pagination == undefined) {
      throw new Error(`${PaginationService.name} is not initialized yet`);
    }
    return this.#pagination;
  }

  protected get prisma(): PrismaService {
    if (this.#prisma == undefined) {
      throw new Error(`${PrismaService.name} is not initialized yet`);
    }
    return this.#prisma;
  }

  private buildOrderByArgs<
    A extends Prisma.Args<PrismaClient[Delegate], FindMany>,
  >({ args, orderBy }: { args?: A; orderBy: A['orderBy'] }) {
    const newArgs = structuredClone(args ?? ({} as A));
    newArgs.orderBy = orderBy;
    return newArgs;
  }
}
