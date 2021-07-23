import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { combineLatest, concat, merge } from "rxjs";
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
  const [count, count$] = useService(CountService.ins);
  const [_, log$] = useService(LogService.ins);
  const [stream$] = useState(combineLatest([count$, log$]));

  return (
    <RxBuilder stream={stream$}>
      {(snap) => {
        if (!snap.hasData) return null;
        return (
          <div className="app">
            <div className="count">
              <p>{count.count}</p>
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
      }}
    </RxBuilder>
  );
}

function TestPage() {
  const [service, count$] = useService(CountService.ins);
  return (
    <RxBuilder stream={count$}>
      {(snap) => {
        if (!snap.hasData) return null;
        return (
          <div className="app">
            <div className="count">
              <p>{service.count}</p>
              <button onClick={CountService.ins.inc}>click me</button>
            </div>
          </div>
        );
      }}
    </RxBuilder>
  );
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/test">
        <TestPage />
      </Route>
      <Route path="/">
        <HomePage />
      </Route>
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
