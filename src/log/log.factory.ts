import { Log } from './log.model';
import { LogLevel } from './log-levels.enum';
import { Observable } from 'rxjs';

export class LogFactory {
  static default(): ILog {
    return new Log();
  }
}

export interface ILogger {
  log(message: string, level?: LogLevel): void;
  logs(level: LogLevel): Observable<ILog>;
}

export interface ILog {
  level: LogLevel;
  mesagge: string;
}
