;(function() {
  var recognition
  var inputElement = document.getElementById('input')
  var loaderElement = document.getElementById('loader')
  var logsElement = document.getElementById('logs')
  var historyElement = document.getElementById('history')
  var lastHistory
  var lastEvent

  loaderElement.style.display = 'none'

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
  recognition = new Speechless.RecognitionFactory(
    'en',
    blob => {
      return new Promise(resolve => {
        var reader = new window.FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = function() {
          base64data = reader.result
          fetch(
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
                  content: base64data.substr(base64data.indexOf(',') + 1)
                }
              })
            }
          )
            .then(res => res.json())
            .then(res => {
              if (!res || isEmpty(res)) {
                return resolve('')
              }
              return resolve(res.results['0'].alternatives['0'].transcript)
            })
        }
      })
    },
    0
  )
  recognition.addEventListener('start', logger)
  recognition.addEventListener('end', logger)
  recognition.addEventListener('data', logger)
  recognition.addEventListener('stop', logger)
  recognition.addEventListener('fetching', () => {
    loaderElement.style.display = ''
  })
  recognition.addEventListener('fetching', logger)
  recognition.addEventListener('data', e => {
    loaderElement.style.display = 'none'

    inputElement.value = e.detail
    history(e.detail)
  })

  document.getElementById('listen').addEventListener('click', () => {
    recognition.listen()
    lastHistory = moment()
    lastEvent = moment()
  })
  document.getElementById('stop').addEventListener('click', () => {
    recognition.stop()
  })
  document.getElementById('kill').addEventListener('click', () => {
    recognition.kill()
  })
  document.getElementById('reset').addEventListener('click', () => {
    inputElement.value = ''
  })
})()
