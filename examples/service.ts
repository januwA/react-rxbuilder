import { Injectable } from "../src";

@Injectable("instance")
export class LogService {
  static instance: LogService;

  len = 0;
  logs: string[] = [];
  log() {
    this.logs.push(`(${++this.len}) Log: ${new Date().toLocaleTimeString()}`);
  }
}

@Injectable()
export class CountService {
  static ins: CountService;

  constructor(public log: LogService) {}

  private _count = 0;
  get count(): number {
    return this._count;
  }

  inc = () => {
    this._count++;
    this.log.log();
  };
}
