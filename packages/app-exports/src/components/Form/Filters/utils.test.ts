import { isoDateToDayEdge } from './utils'

describe('isoDateToDayEdge', () => {
  test('should set start of the day', () => {
    expect(isoDateToDayEdge('2023-02-17T09:31:28.454Z', 'startOfTheDay')).toBe(
      '2023-02-17T00:00:00.000Z'
    )
  })

  test('should set end of the day', () => {
    expect(isoDateToDayEdge('2023-02-17T09:31:28.454Z', 'endOfTheDay')).toBe(
      '2023-02-17T23:59:59.999Z'
    )
  })

  test('should skip parsing when broken date is passed', () => {
    expect(isoDateToDayEdge('2023-02-17T09:31:28.4', 'endOfTheDay')).toBe(
      undefined
    )
  })

  test('should skip parsing when partial date is passed', () => {
    expect(isoDateToDayEdge('2023-02-17', 'endOfTheDay')).toBe(undefined)
  })

  test('should skip parsing with no date string', () => {
    expect(isoDateToDayEdge('hello', 'endOfTheDay')).toBe(undefined)
  })
})
