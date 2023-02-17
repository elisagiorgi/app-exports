import { QueryParamsList } from '@commercelayer/sdk'
import { AllFilters } from 'AppForm'
import { endOfDay, startOfDay } from 'date-fns'

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
  try {
    const date = new Date(isoString)
    if (date == null || isoString == null) {
      return undefined
    }

    if (edge === 'startOfTheDay') {
      return startOfDay(date).toISOString() ?? undefined
    }

    if (edge === 'endOfTheDay') {
      return endOfDay(date).toISOString() ?? undefined
    }

    return undefined
  } catch {
    return undefined
  }
}
