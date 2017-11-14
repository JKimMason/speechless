# Speech to text recognition tool that's simplified the API

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/puemos/speech-to-text-recognition.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/puemos/speech-to-text-recognition.svg)](https://travis-ci.org/puemos/speech-to-text-recognition)
[![Coveralls](https://img.shields.io/coveralls/puemos/speech-to-text-recognition.svg)](https://coveralls.io/github/puemos/speech-to-text-recognition)
[![Dev Dependencies](https://david-dm.org/puemos/speech-to-text-recognition/dev-status.svg)](www.n.n)


### Usage

```js

import Recognition from 'speech-to-text-recognition';

const onChange = text => console.log(text)
const onEnd = text => console.log(text)
const onStop = () => console.log('stopped')

const recognition = new Recognition(onChange, onEnd, onStop, 'en')

recognition.listen()

```

### Features

- Native chrome support
- Recording with web workers
- Optional visualization
- Fallback to external API
- Simplify the api
