# event-emitter

This is a wrapper for @nestjs/event-emitter to be more aware of types when emitting events making it easier for developers to validate payloads during development

## Fire an event

```typescript
interface IMyEventData {
  some: string;
}

import { Module } from '@nestjs/common';
import { EventEmitterModule } from 'src/common/event-emitter';
import { MyModuleController } from './somewhere';
import { MyModuleService } from './somewhere';

@Module({
  imports: [EventEmitterModule],
  controllers: [MyModuleController],
  providers: [MyModuleService],
})
export class MyModuleThatEmitsEvents {}

export class MyServiceWithEvents {
  constructor(private eventEmitterService: EventEmitterService) {}

  doStuff(props: any) {
    this.eventEmitterService.emit<IMyEventData>('my.event.name', {
      some: 'data',
    });

    // Or Async
    this.eventEmitterService.emitAsync<IMyEventData>('my.event.name', {
      some: 'data',
    });
  }
}
```

## Handling an event

```typescript
export class MyServiceHandlingEvents {
  // Handle any events in the 'my' namespace
  @OnEvent('my.*')
  handleEvent(payload: IMyEventData) {
    console.log({ payload });
  }

  // Handle the 'my.event.name' event specifically
  @OnEvent('my.event.name')
  handleEvent(payload: IMyEventData) {
    console.log({ payload });
  }
}
```
