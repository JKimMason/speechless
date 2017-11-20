const Worker = require('worker-loader!./recorder.worker')

export class Recorder {
  private recording: boolean
  private bufferLen: number
  private context: AudioContext
  private node: ScriptProcessorNode
  private worker: Worker

  constructor(
    private source: GainNode,
    private currCallback: (blob?: any) => any = () => {
      return
    }
  ) {
    this.onAudioProcess = this.onAudioProcess.bind(this)
    this.worker = Worker()
    this.recording = false
    this.bufferLen = 4096
    this.context = source.context
    this.node = this.context.createScriptProcessor(this.bufferLen, 2, 2)
    source.connect(this.node)
    this.node.connect(this.context.destination)
    this.node.addEventListener('audioprocess', this.onAudioProcess)
    recorderUtils.init(this.context.sampleRate)
  }

  onWorkerMessage(ev: MessageEvent) {
    const blob = ev.data
    this.currCallback(blob)
  }
  onAudioProcess(ev: AudioProcessingEvent): void {
    if (!this.recording) {
      return
    }
    const res = recorderUtils.record([
      ev.inputBuffer.getChannelData(0),
      ev.inputBuffer.getChannelData(1)
    ])
    this.currCallback(res)
  }
  record() {
    this.recording = true
  }

  stop() {
    this.recording = false
  }

  clear() {
    recorderUtils.clear()
  }

  getBuffer(cb: () => any) {
    this.currCallback = cb
    const res = recorderUtils.getBuffer()
    this.currCallback(res)
  }

  exportWAV(cb: () => any, type: string = 'audio/wav') {
    this.currCallback = cb
    const res = recorderUtils.exportWAV(type)
    this.currCallback(res)
  }

  exportMonoWAV(cb: () => any, type: string) {
    this.currCallback = cb
    const res = recorderUtils.exportMonoWAV(type)
    this.currCallback(res)
  }
}

export default Recorder
