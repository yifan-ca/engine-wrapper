import { Injectable, Logger } from '@nestjs/common';

import { DYNAMIC_MESSAGE_PATTERN_METADATA } from './dynamic-message.pattern';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class DynamicPatternService {
  private readonly logger = new Logger(DynamicPatternService.name);

  processDecorators(types: any[]) {
    for (const type of types) {
      const propNames = Object.getOwnPropertyNames(type.prototype);
      for (const prop of propNames) {
        const propValue = Reflect.getMetadata(
          DYNAMIC_MESSAGE_PATTERN_METADATA,
          Reflect.get(type.prototype, prop),
        );

        if (propValue) {
          const pattern = process.env[propValue];
          this.logger.log(
            `Setting message pattern ${pattern} for ${type.name}#${prop}`,
          );
          Reflect.decorate(
            [MessagePattern(pattern)],
            type.prototype,
            prop,
            Reflect.getOwnPropertyDescriptor(type.prototype, prop),
          );
        }
      }
    }
  }
}
