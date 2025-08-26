// lib/utils/logger.ts
export class Logger {
  private static formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (meta) {
      return `${formattedMessage} | Meta: ${JSON.stringify(meta)}`;
    }
    
    return formattedMessage;
  }

  static info(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(this.formatMessage('INFO', message, meta));
    }
  }

  static warn(message: string, meta?: any): void {
    console.warn(this.formatMessage('WARN', message, meta));
  }

  static error(message: string, error?: any, meta?: any): void {
    const errorMessage = error ? `${message} | Error: ${error.message || error}` : message;
    console.error(this.formatMessage('ERROR', errorMessage, meta));
    
    // In production, you might want to send errors to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: send to Sentry, LogRocket, etc.
      // this.sendToMonitoringService(errorMessage, error, meta);
    }
  }

  static debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(this.formatMessage('DEBUG', message, meta));
    }
  }
}

// Convenience functions
export const logInfo = (message: string, meta?: any) => Logger.info(message, meta);
export const logWarn = (message: string, meta?: any) => Logger.warn(message, meta);
export const logError = (message: string, error?: any, meta?: any) => Logger.error(message, error, meta);
export const logDebug = (message: string, meta?: any) => Logger.debug(message, meta);