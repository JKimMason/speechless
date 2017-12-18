function remoteCall(content) {
  return fetch(
    'https://content-speech.googleapis.com/v1/speech:recognize?alt=json&key=AIzaSyBW2ROnSfou8fo0J7Pa-B2uPq3U45V-jnk',
    {
      method: 'post',
      body: JSON.stringify({
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 44100,
          languageCode: 'en',
          maxAlternatives: 1
        },
        audio: {
          content
        }
      })
    }
  )
}
function toBase64(blob) {
  var reader = new window.FileReader()
  return new Promise(resolve => {
    reader.readAsDataURL(blob)
    reader.onloadend = function() {
      resolve(reader.result)
    }
  })
}
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false
  }
  return true
}

export const getRecognition = blob =>
  toBase64(blob)
    .then(base64data => base64data.substr(base64data.indexOf(',') + 1))
    .then(remoteCall)
    .then(res => res.json())
    .then(res => {
      if (!res || isEmpty(res)) {
        return ''
      }
      return res.results[0].alternatives[0].transcript
    })
