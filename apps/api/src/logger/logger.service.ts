import { Injectable, Scope } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

export interface LogMetadata {
  [key: string]: any;
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  constructor(
    private readonly logger: Logger,
    private readonly context: string
  ) {}

  private formatMetadata(metadata?: LogMetadata): string {
    if (!metadata) return '';
    return ` ${JSON.stringify(metadata)}`;
  }

  logWithMetadata(message: string, metadata?: LogMetadata) {
    this.logger.log(message + this.formatMetadata(metadata), this.context);
  }

  errorWithMetadata(message: string, error?: Error, metadata?: LogMetadata) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    this.logger.error(`${message} - ${errorMessage}${this.formatMetadata(metadata)}`, this.context);
  }

  warnWithMetadata(message: string, metadata?: LogMetadata) {
    this.logger.warn(message + this.formatMetadata(metadata), this.context);
  }

  debugWithMetadata(message: string, metadata?: LogMetadata) {
    this.logger.debug(message + this.formatMetadata(metadata), this.context);
  }

  // Helper method for operation logging
  async logOperation<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: LogMetadata
  ): Promise<T> {
    this.debugWithMetadata(`${operation} started`, metadata);
    try {
      const result = await fn();
      this.logWithMetadata(`${operation} completed`, metadata);
      return result;
    } catch (error) {
      this.errorWithMetadata(`${operation} failed`, error as Error, metadata);
      throw error;
    }
  }
}
