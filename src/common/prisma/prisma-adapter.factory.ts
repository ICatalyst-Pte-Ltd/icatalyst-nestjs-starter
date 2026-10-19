import { Injectable } from '@nestjs/common';
import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/client';

@Injectable()
export class PrismaAdapterFactory {
  create<
    T extends new (
      ...options: ConstructorParameters<T>
    ) => InstanceType<T> & SqlDriverAdapterFactory,
  >(Adapter: T, ...options: ConstructorParameters<T>): InstanceType<T> {
    return new Adapter(...options);
  }
}
