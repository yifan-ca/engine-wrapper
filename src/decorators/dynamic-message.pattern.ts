export const DYNAMIC_MESSAGE_PATTERN_METADATA = '__dunamic-message-pattern';

export function DynamicMessagePattern(variable: string): any {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(
      DYNAMIC_MESSAGE_PATTERN_METADATA,
      variable,
      descriptor.value,
    );
    return descriptor;
  };
}
