;(function() {
  var recognition
  var loaderElement = document.getElementById('loader')
  var logsElement = document.getElementById('logs')
  var historyElement = document.getElementById('history')
  var lastHistory
  var lastEvent

  loaderElement.style.display = 'none'
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
  function prepareReport(content, time) {
    var report = document.createElement('div')
    var reportTime = document.createElement('div')
    var reportContent = document.createElement('div')

    reportTime.innerHTML = `+${time}`
    reportTime.classList.add('uk-label')
    reportTime.classList.add('report-time')
    reportContent.innerHTML = `${content}`
    report.appendChild(reportContent)
    report.appendChild(reportTime)
    report.classList.add('report')
    report.classList.add('uk-flex')
    report.classList.add('uk-flex-row')
    report.classList.add('uk-flex-between')
    return report
  }
  function logger(event) {
    const now = moment()
    var diff = now.diff(lastEvent || now, 'milliseconds')
    lastEvent = now

    const report = prepareReport(event.type, diff)

    logsElement.insertBefore(report, logsElement.firstChild)
  }
  function history(text) {
    const now = moment()
    var diff = now.diff(lastHistory || now, 'milliseconds')
    lastHistory = now

    const report = prepareReport(text, diff)

    historyElement.insertBefore(report, historyElement.firstChild)
  }
  function setup(type) {
    recognition = new Speechless[type || 'RecognitionFactory']('en', blob => {
      return toBase64(blob)
        .then(base64data => base64data.substr(base64data.indexOf(',') + 1))
        .then(remoteCall)
        .then(res => res.json())
        .then(res => {
          if (!res || isEmpty(res)) {
            return ''
          }
          return res.results[0].alternatives[0].transcript
        })
    })
    recognition.addEventListener('start', logger)
    recognition.addEventListener('end', logger)
    recognition.addEventListener('data', logger)
    recognition.addEventListener('stop', logger)
    recognition.addEventListener('fetching', logger)
    recognition.addEventListener('fetching', () => {
      loaderElement.style.display = ''
    })
    recognition.addEventListener('data', e => {
      loaderElement.style.display = 'none'
      history(e.detail)
    })
  }

  document.getElementById('listen').addEventListener('click', () => {
    gtag('event', 'listen');
    recognition.listen()
    lastHistory = moment()
    lastEvent = moment()
  })
  document.getElementById('stop').addEventListener('click', () => {
    gtag('event', 'stop');
    recognition.stop()
  })
  document.getElementById('kill').addEventListener('click', () => {
    gtag('event', 'kill');
    recognition.kill()
  })
  document.getElementById('external').addEventListener('click', () => {
    document.getElementById('auto').classList.remove('active')
    document.getElementById('external').classList.add('active')
    document.getElementById('native').classList.remove('active')
    gtag('event', 'external');
    setup('ExternalRecognition')
  })
  document.getElementById('native').addEventListener('click', () => {
    document.getElementById('auto').classList.remove('active')
    document.getElementById('external').classList.remove('active')
    document.getElementById('native').classList.add('active')
    gtag('event', 'native');
    setup('NativeRecognition')
  })
  document.getElementById('auto').addEventListener('click', () => {
    document.getElementById('auto').classList.add('active')
    document.getElementById('external').classList.remove('active')
    document.getElementById('native').classList.remove('active')
    gtag('event', 'auto');
    setup()
  })

  setup()
  document.getElementById('auto').classList.add('active')
})()
