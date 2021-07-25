## react-rxbuilder

Use rxjs Observable on react components, Inspiration comes from flutter's  [StreamBuilder](https://api.flutter.dev/flutter/widgets/StreamBuilder-class.html)

Use dependency injection to create services, inspired by Angular


## Install
```
$ npm i react-rxbuilder
$ npm i rxjs
```

Add two configurations to `tsconfig.json`

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
  },
}
```

## use RxBuilder

```tsx
import { useEffect, useState } from "react";
import { RxBuilder, ConnectionState } from "react-rxbuilder";
import { map, timer } from "rxjs";

export function TestPage() {
  const [timer$] = useState(
    timer(1000, 500).pipe(
      map((v) => {
        if (v === 20) throw `error number ${v}.`;
        return v;
      })
    )
  );

  useEffect(() => {
    return () => {
      timer$.subscribe();
    };
  }, []);

  return (
    <RxBuilder stream={timer$}>
      {(snap) => {
        console.log(snap.toString());

        if (snap.connectionState === ConnectionState.waiting) {
          return <p>loading...</p>;
        }

        if (
          snap.connectionState === ConnectionState.active ||
          snap.connectionState === ConnectionState.done
        ) {
          if (snap.hasError) return <p>{snap.error}</p>;

          if (!snap.hasData) return <p>not data</p>;

          return <p>{snap.data}</p>;
        }

        return null;
      }}
    </RxBuilder>
  );
}
```

## use Subject
```tsx
import { useState } from "react";
import { RxBuilder } from "react-rxbuilder";
import { BehaviorSubject, debounceTime } from "rxjs";

function IncBut(props: { count$: BehaviorSubject<number> }) {
  const inc = () => props.count$.next(props.count$.value + 1);
  return <button onClick={inc}>inc</button>;
}

export function TestPage() {
  const [count$] = useState(new BehaviorSubject<number>(0));
  const [count2$] = useState(count$.pipe(debounceTime(200)));

  useEffect(() => {
    return () => {
      count$.unsubscribe();
    };
  }, []);

  return (
    <>
      <RxBuilder stream={count2$}>
        {(snap) => {
          if (snap.hasData)
            return (
              <p>
                {snap.data}
                <IncBut count$={count$} />
              </p>
            );
          return null;
        }}
      </RxBuilder>

      <RxBuilder stream={count$}>
        {(snap) => {
          if (snap.hasData)
            return (
              <p>
                {snap.data}
                <IncBut count$={count$} />
              </p>
            );
          return null;
        }}
      </RxBuilder>
    </>
  );
}
```

## Get asynchronous data
```tsx
import { useState } from "react";
import { ConnectionState, RxBuilder } from "react-rxbuilder";
import { from, switchMap } from "rxjs";

export function TestPage() {
  const [json$] = useState(
    from(fetch("https://jsonplaceholder.typicode.com/todos/1")).pipe(
      switchMap((e) => e.json())
    )
  );
  return (
    <RxBuilder stream={json$}>
      {(snap) => {
        console.log(snap);
        
        if (snap.connectionState === ConnectionState.waiting)
          return <p>loading...</p>;

        if (snap.hasData) return <p>{JSON.stringify(snap.data)}</p>;

        return null;
      }}
    </RxBuilder>
  );
}
```

## PromiseBuilder

```tsx
import { ConnectionState, PromiseBuilder } from "react-rxbuilder";

export function TestPage() {
  return (
    <>
      <PromiseBuilder promise={Promise.resolve(1)}>
        {(snap) => {
          if (snap.hasData) return <p>{snap.data}</p>;
          return null;
        }}
      </PromiseBuilder>
      
      <PromiseBuilder promise={Promise.reject("error")}>
        {(snap) => {
          if (snap.hasError) return <p>{snap.error}</p>;
          return null;
        }}
      </PromiseBuilder>

      <PromiseBuilder
        promise={fetch("https://jsonplaceholder.typicode.com/todos/1").then(
          (r) => r.json()
        )}
      >
        {(snap) => {
          if (snap.connectionState === ConnectionState.waiting)
            return <p>loading...</p>;

          if (snap.hasError) return <p>Error: {snap.error}</p>;

          if (snap.hasData) return <p>{JSON.stringify(snap.data)}</p>;

          return null;
        }}
      </PromiseBuilder>
    </>
  );
}
```

## RxService

Dependency injection service

*When there is a dependency cycle, do not hesitate to write the two dependencies as one*

*Do not use arrow functions in the service*

```ts
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Injectable, RxService } from "react-rxbuilder";

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
  constructor(public log: LogService) {}

  count = 0;
  inc() {
    // Use instance instead of this in arrow functions
    CountService.ins.count++;
    this.log.log();
  }
}

ReactDOM.render(
  <BrowserRouter>
    <RxService>
      {() => (
        <Switch>
          <Route path="/test">
            <p>{CountService.ins.count}</p>
            <button onClick={CountService.ins.inc}>click me</button>
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
```

- [todos example](https://codesandbox.io/s/rxbuilder-todos-yw5ux)
- If you don’t know anything, you can press `f12` on the api, and the editor will navigate you to the source code of the api (if you are using vscode)
- [What else??](https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley)