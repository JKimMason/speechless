# [![logo-text](https://user-images.githubusercontent.com/13174025/33795461-01f88668-dce2-11e7-8e44-b6d751e1bd73.png)](https://speechless.surge.sh/)

Speech to text recognition with remote fallback (Native/External)




[![Greenkeeper badge](https://badges.greenkeeper.io/puemos/speechless.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/puemos/speechless.svg)](https://travis-ci.org/puemos/speechless)
[![Coveralls](https://img.shields.io/coveralls/puemos/speechless.svg)](https://coveralls.io/github/puemos/speechless)
[![Dev Dependencies](https://david-dm.org/puemos/speechless/dev-status.svg)](https://david-dm.org/puemos/speechless)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Why

 - **Save money and use native speech-to-text recognition**
 - Hide the complexity with a simple interface
 - Easy events
 - **100% test and coverage**
 - **Types** for better development


## Demo

https://speechless.surge.sh/


## Docs

https://puemos.github.io/speechless

## Install

```bash
$ npm i speechless --save
```

```sh
$ yarn add speechless
```

```html
<script src="https://rawgit.com/puemos/speechless/master/dist/speechless.umd.js"></script>
```

### Usage

```typescript

import { RecognitionFactory } from 'speechless';

// Create event listeners
const onData = (data: string | any) => console.log(data)
const onStart = () => console.log('start')
const onFetching = () => console.log('feching')
const onEnd = () => console.log('ended')
const onStop = () => console.log('stopped')

// Fallback function for remote call recognition
function remoteCall(blob: Blob){
  return fetch("/remote/recognition", {
    method: "POST",
    body: blob
  })
  .then(function(res){ return res.json(); })
}

// Create new instance
const recognition = RecognitionFactory('en', remoteCall)

// Connect the listeners
recognition.addEventListener('end', onEnd)
recognition.addEventListener('data', onData)
recognition.addEventListener('fetching', onFetching)
recognition.addEventListener('stop', onStop)
recognition.addEventListener('start', onStart)

// Start listening
recognition.listen()

```
