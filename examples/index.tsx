import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Injectable, RxService, useService } from "../src";

@Injectable("instance")
export class LogService {
  static instance: LogService;

  private len = 0;
  logs: string[] = [];
  log() {
    this.logs.push(`(${++this.len}) Log: ${new Date().toLocaleTimeString()}`);
  }
}

@Injectable()
export class CountService {
  static ins: CountService;

  constructor() {}

  private _count = 0;
  get count(): number {
    return this._count;
  }

  inc = () => {
    this._count++;
    console.log(Injectable.prototype);
  };
}

function TestPage() {
  const [c] = useService([CountService]);

  return (
    <>
      <p>{c.count}</p>
      <button onClick={c.inc}>click me</button>
    </>
  );
}

ReactDOM.render(
  <BrowserRouter>
    <RxService>
      {() => (
        <Switch>
          <Route path="/test">
            <TestPage></TestPage>
          </Route>

          <Route path="/">
            <button onClick={CountService.ins.inc}>
              click me {CountService.ins.count}
            </button>
            <br />
            <Link to="/test">Go To About Page</Link>
            <ul>
              {LogService.instance.logs.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </Route>
        </Switch>
      )}
    </RxService>
  </BrowserRouter>,

  document.getElementById("root")
);
