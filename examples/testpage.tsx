import { Injectable, useService } from "../src";
import { CountService } from "./service";

@Injectable()
class LazyService {
  x = 0;
  add() {
    this.x++;
  }
}

@Injectable()
export class LogService {
  len = 0;
  logs: string[] = [];
  log() {
  }
}

export default function TestPage() {
  const [c, lz] = useService(CountService, LazyService);
  return (
    <>
      <p>CountService: {c.count}</p>
      <p>LazyService: {lz.x}</p>
      <button onClick={lz.add}>click me</button>
    </>
  );
}
