import { LogLevel } from './log-levels.enum';
import { ILog } from './log.factory';

export class Log implements ILog {
  level: LogLevel;
  mesagge: string;

  constructor() {
    this.level = LogLevel.DEFAULT;
    this.mesagge = '';
  }

  default(): ILog {
    return new Log();
  }
}
