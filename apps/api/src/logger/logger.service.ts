import { Injectable, Logger, Scope } from '@nestjs/common';

export interface LogMetadata {
  [key: string]: any;
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  constructor(context?: string) {
    super(context || 'App');
  }

  private formatMetadata(metadata?: LogMetadata): string {
    if (!metadata) return '';
    return ` ${JSON.stringify(metadata)}`;
  }

  logWithMetadata(message: string, metadata?: LogMetadata) {
    super.log(message + this.formatMetadata(metadata));
  }

  errorWithMetadata(message: string, error?: Error, metadata?: LogMetadata) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    super.error(`${message} - ${errorMessage}${this.formatMetadata(metadata)}`);
  }

  warnWithMetadata(message: string, metadata?: LogMetadata) {
    super.warn(message + this.formatMetadata(metadata));
  }

  debugWithMetadata(message: string, metadata?: LogMetadata) {
    super.debug(message + this.formatMetadata(metadata));
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
