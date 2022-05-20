import { Injectable } from '@nestjs/common';
import Ajv from 'ajv';

@Injectable()
export class AjvService extends Ajv {}
