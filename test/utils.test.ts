import { getNavigatorUserMedia } from '../src/utils'

const constraints = {
  audio: {
    advanced: [
      {
        echoCancelation: false
      }
    ]
  }
}

describe('getUserMedia', () => {
  it('should throw an error no getUserMedia', () => {
    delete (global as any).navigator
    ;(global as any).navigator = {}
    expect(() =>
      getNavigatorUserMedia(constraints, jest.fn(), jest.fn())
    ).toThrow()
  })
  it('should use webkitGetUserMedia', () => {
    delete (global as any).navigator
    ;(global as any).navigator = {
      webkitGetUserMedia: jest.fn()
    }
    expect(() =>
      getNavigatorUserMedia(constraints, jest.fn(), jest.fn())
    ).not.toThrow()
  })
  it('should use mozGetUserMedia', () => {
    delete (global as any).navigator
    ;(global as any).navigator = {
      mozGetUserMedia: jest.fn()
    }
    expect(() =>
      getNavigatorUserMedia(constraints, jest.fn(), jest.fn())
    ).not.toThrow()
  })
  it('should use mozGetUserMedia', () => {
    delete (global as any).navigator
    ;(global as any).navigator = {
      mediaDevices: {
        getUserMedia: jest.fn()
      }
    }
    expect(() =>
      getNavigatorUserMedia(constraints, jest.fn(), jest.fn())
    ).not.toThrow()
  })
})
