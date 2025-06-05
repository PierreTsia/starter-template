declare module 'class-validator' {
  export function IsEmail(): PropertyDecorator;
  export function IsNotEmpty(): PropertyDecorator;
  export function IsOptional(): PropertyDecorator;
  export function IsString(): PropertyDecorator;
  export function MinLength(length: number): PropertyDecorator;
  export function Matches(pattern: RegExp, options?: { message?: string }): PropertyDecorator;
}
