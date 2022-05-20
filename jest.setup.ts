import { Logger } from '@nestjs/common';
import 'reflect-metadata';

Logger.prototype.debug = jest.fn();
Logger.prototype.error = jest.fn();
Logger.prototype.log = jest.fn();
Logger.prototype.warn = jest.fn();
