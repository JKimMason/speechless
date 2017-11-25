# Speech to text recognition tool that's simplified the API

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/puemos/speechless.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/puemos/speechless.svg)](https://travis-ci.org/puemos/speechless)
[![Coveralls](https://img.shields.io/coveralls/puemos/speechless.svg)](https://coveralls.io/github/puemos/speechless)
[![Dev Dependencies](https://david-dm.org/puemos/speechless/dev-status.svg)](https://david-dm.org/puemos/speechless)


### Usage

```js

import SpeechToTextRecognition from 'speechless';

const onChange = text => console.log(text)
const onEnd = text => console.log(text)
const onStop = () => console.log('stopped')

const recognition = new SpeechToTextRecognition(onChange, onEnd, onStop, 'en')

recognition.listen()

```

### Features

- Native chrome support
- Recording with web workers
- Optional visualization
- Fallback to external API
- Simplify the api
