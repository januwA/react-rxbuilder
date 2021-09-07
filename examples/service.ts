import { Injectable, OnChanged, OnCreate, OnUpdate } from "../src";

@Injectable()
export class LogService {
  len = 0;
  logs: string[] = [];
  log() {
    this.logs.push(`(${++this.len}) Log: ${new Date().toLocaleTimeString()}`);
  }
}

@Injectable()
export class CountService /* implements OnCreate, OnChanged, OnUpdate*/ {
  constructor(public log: LogService) {}

  // async initCount() {
  //   const data = JSON.parse(localStorage.getItem("count") ?? "");
  //   this.count = data.count;
  //   Object.assign(this.log, data.log);
  // }

  // async OnCreate() {
  //   await this.initCount();
  // }

  // OnUpdate() {
  //   localStorage.setItem("count", JSON.stringify(this));
  // }

  // OnChanged() {
  //   console.log("OnChanged");
  // }

  count = 0;
  inc() {
    this.count++;
    this.count++;
    this.log.log();
  }
}
