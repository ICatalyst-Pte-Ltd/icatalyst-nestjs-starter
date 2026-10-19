import { Type } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma, PrismaClient } from '~prisma/client.js';
import { Type as TransformType } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { TransformToInstance } from '../../transforms/index.js';
import { DelegateName, FindMany } from '../prisma.types.js';

type StringKeys<T> = Extract<keyof T, string>;

type OrderableTypes = boolean | number | string | Date;

type OrderableKeys<T> = {
  [Key in StringKeys<T>]: T[Key] extends OrderableTypes ? Key : never;
}[StringKeys<T>];

type ExtractArray<T> = T extends Array<unknown> ? T : never;

type OrderByItem = ExtractArray<
  Prisma.Args<PrismaClient[DelegateName], FindMany>['orderBy']
>;

export interface OrderBy {
  readonly orderBy?: OrderByItem;
}

export function createOrderBy<T>(
  classRef: Type<T>,
  keys: ReadonlyArray<OrderableKeys<T>>,
): Type<OrderBy> {
  class OrderByItemClass {}
  for (const key of keys) {
    ApiPropertyOptional({ enum: Prisma.SortOrder, enumName: 'SortOrder' })(
      OrderByItemClass.prototype,
      key,
    );
    IsEnum(Prisma.SortOrder)(OrderByItemClass.prototype, key);
    IsOptional()(OrderByItemClass.prototype, key);
  }
  Object.defineProperty(OrderByItemClass, 'name', {
    value: `Order${classRef.name}ByItem`,
  });

  class OrderByClass implements OrderBy {
    /**
     * Sort of a list of records by a particular field or set of fields.
     */
    @ApiPropertyOptional({
      description: `Sort a list of \`${classRef.name}\` by a particular allowed field or set of allowed fields. Allowed fields are ${keys.map((key) => `\`${key}\``).join(', ')}.`,
      isArray: true,
      type: OrderByItemClass,
    })
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @TransformToInstance(OrderByItemClass, { array: true })
    @TransformType(() => OrderByItemClass)
    readonly orderBy?: OrderByItem;
  }
  Object.defineProperty(OrderByClass, 'name', {
    value: `Order${classRef.name}By`,
  });

  return OrderByClass;
}
