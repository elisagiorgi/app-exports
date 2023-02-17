import { QueryParamsList } from '@commercelayer/sdk'
import { AllFilters } from 'AppForm'

export function adaptFormFiltersToSdk(
  filters?: AllFilters
): QueryParamsList['filters'] {
  if (filters == null) {
    return
  }

  const allFiltersKeys = Object.keys(filters) as Array<keyof AllFilters>
  const cleanSdkFilters = allFiltersKeys.reduce((skdFilters, filterKey) => {
    let value = filters[filterKey]

    // remove undefined
    if (value == null) {
      return skdFilters
    }

    // remove empty array
    if (Array.isArray(value) && value.length === 0) {
      return skdFilters
    }

    // dates `grater than` should always have 00:00:00 time
    if (filterKey.includes('at_gteq') && typeof value === 'string') {
      value = isoDateToDayEdge(value, 'startOfTheDay')
    }

    // dates `lower than` should always have 23:59:59 time
    if (filterKey.includes('at_lteq') && typeof value === 'string') {
      value = isoDateToDayEdge(value, 'endOfTheDay')
    }

    // parsing string as boolean
    if (value === 'true') {
      value = true
    }
    if (value === 'false') {
      value = false
    }

    return {
      ...skdFilters,
      [filterKey]: value
    }
  }, {})

  return cleanSdkFilters
}

type IsoDate = string
export function isoDateToDayEdge(
  isoString: IsoDate,
  edge: 'startOfTheDay' | 'endOfTheDay'
): string | undefined {
  const isoDateRegex =
    /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/

  if (!isoDateRegex.test(isoString)) {
    return undefined
  }

  const date = isoString.split('T')[0]

  if (edge === 'startOfTheDay') {
    return `${date}T00:00:00.000Z`
  }

  if (edge === 'endOfTheDay') {
    return `${date}T23:59:59.999Z`
  }

  return date
}
