## react-rxbuilder

Use rxjs Observable on react components, Inspiration comes from flutter's  [StreamBuilder](https://api.flutter.dev/flutter/widgets/StreamBuilder-class.html)


## Install
```
$ npm i react-rxbuilder
```

## Example

```tsx
import { useEffect, useState } from "react";
import { RxBuilder, ConnectionState } from "react-rxbuilder";
import { map, timer } from "rxjs";

export function TestPage() {
  const [state, sstate] = useState(0);
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
    <div>
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

      <p>{state}</p>
      <button onClick={() => sstate(state + 1)}>click me</button>
    </div>
  );
}
```

## Example use Subject
```tsx
import { useState } from "react";
import { RxBuilder } from "react-rxbuilder";
import { BehaviorSubject, debounceTime } from "rxjs";

function IncBut(props: { count$: BehaviorSubject<number> }) {
  const inc = () => props.count$.next(props.count$.value + 1);
  return <button onClick={inc}>inc</button>;
}

export function TestPage() {
  const [state, sstate] = useState(0);
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

      <IncBut count$={count$} />
      <button onClick={() => sstate(state + 1)}>click me {state}</button>
    </>
  );
}
```

## Example: Get asynchronous data
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
    <>
      <RxBuilder stream={json$}>
        {(snap) => {
          console.log(snap);
          
          if (snap.connectionState === ConnectionState.waiting)
            return <p>loading...</p>;

          if (snap.hasData) return <p>{JSON.stringify(snap.data)}</p>;

          return null;
        }}
      </RxBuilder>
    </>
  );
}
```

## Example use PromiseBuilder

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