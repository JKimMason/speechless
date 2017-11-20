// https://gist.github.com/amiika/5525347
const ctx: Worker = self as any

let recLength: number = 0
let recBuffersL: Float32Array[] = []
let recBuffersR: Float32Array[] = []
let sampleRate: number

export function init(sampleRate: number): void {
  sampleRate = sampleRate
}
export function floatTo16BitPCM(
  output: DataView,
  offset: number,
  input: Float32Array
) {
  for (let i = 0; i < input.length; i += 1, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]))
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
}

export function writeString(view: DataView, offset: number, type: string) {
  for (let i = 0; i < type.length; i += 1) {
    view.setUint8(offset + i, type.charCodeAt(i))
  }
}
export function encodeWAV(samples: Float32Array, mono = false) {
  const buffer = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buffer)

  /* RIFF identifier */
  writeString(view, 0, 'RIFF')
  /* file length */
  view.setUint32(4, 32 + samples.length * 2, true)
  /* RIFF type */
  writeString(view, 8, 'WAVE')
  /* format chunk identifier */
  writeString(view, 12, 'fmt ')
  /* format chunk length */
  view.setUint32(16, 16, true)
  /* sample format (raw) */
  view.setUint16(20, 1, true)
  /* channel count */
  view.setUint16(22, mono ? 1 : 2, true)
  /* sample rate */
  view.setUint32(24, sampleRate, true)
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * 4, true)
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, 4, true)
  /* bits per sample */
  view.setUint16(34, 16, true)
  /* data chunk identifier */
  writeString(view, 36, 'data')
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true)

  floatTo16BitPCM(view, 44, samples)

  return view
}
export function record(inputBuffer: Float32Array[]) {
  recBuffersL.push(inputBuffer[0])
  recBuffersR.push(inputBuffer[1])
  recLength += inputBuffer[0].length
}
export function interleave(inputL: Float32Array, inputR: Float32Array) {
  const length = inputL.length + inputR.length
  const result = new Float32Array(length)

  let index = 0
  let inputIndex = 0

  while (index < length) {
    result[(index += 1)] = inputL[inputIndex]
    result[(index += 1)] = inputR[inputIndex]
    inputIndex += 1
  }
  return result
}
export function mergeBuffers(recBuffers: Float32Array[], recLength: number) {
  const result = new Float32Array(recLength)
  let offset = 0
  for (let i = 0; i < recBuffers.length; i += 1) {
    result.set(recBuffers[i], offset)
    offset += recBuffers[i].length
  }
  return result
}
export function exportWAV(type: string) {
  const bufferL = mergeBuffers(recBuffersL, recLength)
  const bufferR = mergeBuffers(recBuffersR, recLength)
  const interleaved = interleave(bufferL, bufferR)
  const dataview = encodeWAV(interleaved)
  const audioBlob = new Blob([dataview], { type })

  return audioBlob
}

export function exportMonoWAV(type: string) {
  const bufferL = mergeBuffers(recBuffersL, recLength)
  const dataview = encodeWAV(bufferL, true)
  const audioBlob = new Blob([dataview], { type })
  return audioBlob
}
export function getBuffer() {
  const buffers = []
  buffers.push(mergeBuffers(recBuffersL, recLength))
  buffers.push(mergeBuffers(recBuffersR, recLength))
  return buffers
}

export function clear() {
  recLength = 0
  recBuffersL = []
  recBuffersR = []
}
