/**
 * Levels of engine log
 */
export enum LogLevel {
  DEFAULT = 'default',
  ALL = 'all',
  USER = 'user',
  BEFORE_COMMAND = 'before-command-execute',
  AFTER_COMMAND = 'after-command-execute',
  BEFORE_VALIDATION = 'before-command-validation',
  AFTER_VALIDATION = 'after-command-validation',
}
