import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Injectable, RxService, useService } from "../src";
import { CountService, LogService } from "./service";

const TestPage = React.lazy(() => import("./testpage"));

@Injectable({
  global: false
})
class ScopeService {
  i = 0;
  add() {
    this.i++
  }
}

const Home = () => {
  const [countService, logService, scopeService] = useService(CountService, LogService, ScopeService)
  return <RxService services={[ScopeService]}>
    {() => (<>
      <button onClick={countService.inc}>
        click me {countService.count}
      </button>
      <br />
      <Link to="/test">Go To About Page</Link>
      <p>
        Scope Service {scopeService.i}
        <button onClick={scopeService.add}>add</button>
      </p>
      <ul>
        {logService.logs.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </>)}
  </RxService>
}

ReactDOM.render(
  <BrowserRouter>
    <RxService>
      {() => (
        <Switch>
          <Suspense fallback={<div>Loading...</div>}>
            <Route exact path="/test" component={TestPage} />
            <Route exact path="/">
              <Home></Home>
            </Route>
          </Suspense>
        </Switch>
      )}
    </RxService>
  </BrowserRouter>,
  document.getElementById("root")
);
