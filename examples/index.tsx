import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { RxService, useService } from "../src";
import { CountService, LogService } from "./service";

const TestPage = React.lazy(() => import("./testpage"));

const Home = () => {
  const [countService, logService] = useService(CountService, LogService)
  return <>
    <button onClick={countService.inc}>
      click me {countService.count}
    </button>
    <br />
    <Link to="/test">Go To About Page</Link>
    <ul>
      {logService.logs.map((e) => (
        <li key={e}>{e}</li>
      ))}
    </ul></>
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
