import { Test, TestingModule } from '@nestjs/testing';
import { Ajv } from 'ajv';
import { AjvService } from './ajv.service.js';

describe(AjvService.name, () => {
  let service: AjvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AjvService],
    }).compile();

    service = module.get(AjvService);
  });

  it('should be an Ajv instance', () => {
    expect(service).toBeInstanceOf(Ajv);
  });

  it('should validate data against a schema', () => {
    const validate = service.compile({
      properties: { name: { type: 'string' } },
      required: ['name'],
      type: 'object',
    });

    expect(validate({ name: 'name' })).toBe(true);
    expect(validate({})).toBe(false);
  });
});
