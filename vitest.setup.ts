import 'reflect-metadata';
import { Logger } from '@nestjs/common';

Logger.prototype.debug = vi.fn();
Logger.prototype.error = vi.fn();
Logger.prototype.log = vi.fn();
Logger.prototype.warn = vi.fn();
