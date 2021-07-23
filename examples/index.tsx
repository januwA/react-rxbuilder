import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { combineLatest } from "rxjs";
import { RxBuilder, singleton, useService } from "../src";

export class CountService {
  static ins = new CountService();
  private constructor() {
    return singleton(this);
  }
  count = 0;
  inc() {
    this.count++;
    LogService.ins.log();
  }
}

export class LogService {
  static ins = new LogService();
  private constructor() {
    return singleton(this);
  }

  private len = 0;
  logs: string[] = [];

  log() {
    this.logs.push(`(${++this.len}) Log: ${new Date().toLocaleTimeString()}`);
  }
}

function HomePage() {
  return (
    <div className="app">
      <div className="count">
        <p>{CountService.ins.count}</p>
        <button onClick={CountService.ins.inc}>click me</button>

        <br />
        <Link to="/test">Go To About Page</Link>
        <div>
          <ul>
            {LogService.ins.logs.map((e) => {
              return <li key={e}>{e}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function TestPage() {
  return (
    <div className="app">
      <div className="count">
        <p>{CountService.ins.count}</p>
        <button onClick={CountService.ins.inc}>click me</button>
      </div>
    </div>
  );
}

const allService$ = combineLatest([
  useService(CountService.ins)[1],
  useService(LogService.ins)[1],
]);

ReactDOM.render(
  <BrowserRouter>
    <RxBuilder stream={allService$}>
      {(snap) => {
        if (!snap.hasData) return null;
        return (
          <Switch>
            <Route path="/test">
              <TestPage />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        );
      }}
    </RxBuilder>
  </BrowserRouter>,
  document.getElementById("root")
);
