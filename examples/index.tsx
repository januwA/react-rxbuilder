import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { RxService } from "../src";
import { CountService, LogService } from "./service";

const TestPage = React.lazy(() => import("./testpage"));

ReactDOM.render(
  <BrowserRouter>
    <RxService>
      {() => (
        <Switch>
          <Suspense fallback={<div>Loading...</div>}>
            <Route exact path="/test" component={TestPage} />
            <Route exact path="/">
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
          </Suspense>
        </Switch>
      )}
    </RxService>
  </BrowserRouter>,
  document.getElementById("root")
);
