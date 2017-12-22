# [![logo-text](https://user-images.githubusercontent.com/13174025/33795461-01f88668-dce2-11e7-8e44-b6d751e1bd73.png)](https://speechless.surge.sh/)

Speech to text recognition with remote fallback (Native/External)


[![Travis](https://img.shields.io/travis/puemos/speechless.svg)](https://travis-ci.org/puemos/speechless)
[![Coveralls](https://img.shields.io/coveralls/puemos/speechless.svg)](https://coveralls.io/github/puemos/speechless)
[![Dev Dependencies](https://david-dm.org/puemos/speechless/dev-status.svg)](https://david-dm.org/puemos/speechless)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

* [Why](#why)
* [Installation](#install)
* [Demo](#demo)
* [API](#api)
* [Events](#events)
* [Contributing](#contributing)
* [License](#license)


<a name="why"></a>
## Why

 - **Save money and use native speech-to-text recognition**
 - Hide the complexity with a simple interface
 - Easy events
 - **100% test and coverage**
 - **Types** for better development

<a name="demo"></a>
## Demo

https://speechless.surge.sh/


<a name="docs"></a>
## TypeDocs

https://puemos.github.io/speechless

<a name="install"></a>
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

<a name="usage"></a>
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

<a name="events"></a>
### Events

#### Event `'start'`

`function () {}`

Emitted on successful recognition start

#### Event `'end'`

`function () {}`

Emitted after successful recognition end

#### Event `'stop'`

`function () {}`

Emitted after a force stop.

#### Event `'fetching'`

`function () {}`

Emitted when the the audio is being sent to 3-rd party service

#### Event `'data'`

`function (event) {}`

Emitted when the new recognition data is avialible

`event.detail === 'hello world'`


<a name="contributing"></a>
## Contributing

Speechless is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit.

### Contributors

<table><tbody>
<tr><th align="left">Shy Alter</th><td><a href="https://github.com/puemos">GitHub/puemos</a></td><td><a href="http://twitter.com/puemos">Twitter/@puemos</a></td></tr>

</tbody></table>

<a name="license"></a>
## License

MIT
