;(function() {
  var recognition
  var inputElement = document.getElementById('input')
  var loaderElement = document.getElementById('loader')
  var logsElement = document.getElementById('logs')
  var historyElement = document.getElementById('history')

  loaderElement.style.display = 'none'

  function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false
    }
    return true
  }
  function prepareReport(content) {
    var report = document.createElement('li')
    var reportTime = document.createElement('span')
    var reportContent = document.createElement('span')

    reportTime.innerHTML = `${moment().format('HH:mm:ss:SSSS')}`
    reportTime.classList.add('uk-label')
    reportTime.classList.add('report-time')
    reportContent.innerHTML = `${content}`
    report.appendChild(reportTime)
    report.appendChild(reportContent)
    report.classList.add('report')
    return report
  }
  function logger(event) {
    logsElement.insertBefore(prepareReport(event.type), logsElement.firstChild)
  }
  function history(text) {
    historyElement.insertBefore(prepareReport(text), historyElement.firstChild)
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
            'https://content-speech.googleapis.com/v1/speech:recognize?alt=json&key=AIzaSyCnjdESqUS5buB0r9xDV-1r7YXeYJvesvA',
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
