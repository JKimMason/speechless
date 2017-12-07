# Speech to text recognition tool that's simplified the API

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/puemos/speechless.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/puemos/speechless.svg)](https://travis-ci.org/puemos/speechless)
[![Coveralls](https://img.shields.io/coveralls/puemos/speechless.svg)](https://coveralls.io/github/puemos/speechless)
[![Dev Dependencies](https://david-dm.org/puemos/speechless/dev-status.svg)](https://david-dm.org/puemos/speechless)

### Docs

https://puemos.github.io/speechless


### Usage

```typescript

import { Recognition } from 'speechless';

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
const recognition = Recognition('en', remoteCall)

// Connect the listeners
recognition.addEventListener('end', onEnd)
recognition.addEventListener('data', onData)
recognition.addEventListener('fetching', onFetching)
recognition.addEventListener('stop', onStop)
recognition.addEventListener('start', onStart)

// Start listening
recognition.listen()

```
