import { isoDateToDayEdge } from './utils'

describe('isoDateToDayEdge', () => {
  test('should set start of the day', () => {
    expect(isoDateToDayEdge('2023-02-17T09:31:28.454Z', 'startOfTheDay')).toBe(
      '2023-02-16T23:00:00.000Z'
    )
  })

  test('should set end of the day', () => {
    expect(isoDateToDayEdge('2023-02-17T09:31:28.454Z', 'endOfTheDay')).toBe(
      '2023-02-17T22:59:59.999Z'
    )
  })

  test('should work with partial dates', () => {
    expect(isoDateToDayEdge('2023-02-17', 'endOfTheDay')).toBe(
      '2023-02-17T22:59:59.999Z'
    )
  })

  test('should return undefined when a no-date is passed', () => {
    expect(isoDateToDayEdge('hello', 'endOfTheDay')).toBe(undefined)
    // @ts-expect-error
    expect(isoDateToDayEdge(null, 'endOfTheDay')).toBe(undefined)
    // @ts-expect-error
    expect(isoDateToDayEdge(undefined, 'endOfTheDay')).toBe(undefined)
  })
})
