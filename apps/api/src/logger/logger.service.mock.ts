import { LoggerService } from './logger.service';

export class MockLoggerService extends LoggerService {
  log() {}
  error() {}
  warn() {}
  debug() {}
  verbose() {}
  logWithMetadata() {}
  errorWithMetadata() {}
  warnWithMetadata() {}
  debugWithMetadata() {}
  async logOperation<T>(_operation: string, fn: () => Promise<T>, _metadata?: any): Promise<T> {
    return fn();
  }
}
