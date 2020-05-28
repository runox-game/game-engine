import { Log } from './log.model';
import { LogLevel } from './log-levels.enum';

export class LogFactory {
  static default(): ILog {
    return new Log();
  }
}

export interface ILogger {
  log(data: ILog): void;
}

export interface ILog {
  level: LogLevel;
  mesagge: string;
}
