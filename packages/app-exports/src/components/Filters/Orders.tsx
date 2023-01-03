import { ResourceFinder } from '#components/ResourceFinder'
import {
  InputDateRange,
  InputSelect,
  Spacer,
  flatSelectValues,
  useTokenProvider
} from '@commercelayer/core-app-elements'
import { useState } from 'react'

type FilterKey =
  | 'market_in'
  | 'status_in'
  | 'created_at_gteq'
  | 'created_at_lteq'
type FilterValue = string | number | Array<string | number> | null
type Filters = Record<FilterKey, FilterValue>

const initialFiltersValue: Filters = {
  market_in: null,
  status_in: null,
  created_at_gteq: null,
  created_at_lteq: null
}

export function Orders(): JSX.Element | null {
  const { sdkClient } = useTokenProvider()
  const [filters, setFilter] = useState<Filters>(initialFiltersValue)

  if (sdkClient == null) {
    return null
  }

  const updateFilters = (key: FilterKey, value: FilterValue): void => {
    setFilter((state) => ({
      ...state,
      [key]: value
    }))
  }

  console.log('filters', filters)

  return (
    <div>
      <Spacer bottom='6'>
        <ResourceFinder
          label='Markets'
          resourceType='markets'
          isMulti
          onSelect={(values) => {
            updateFilters('market_in', flatSelectValues(values))
          }}
          sdkClient={sdkClient}
        />
      </Spacer>

      <Spacer bottom='6'>
        <InputSelect
          label='Status'
          initialValues={[
            {
              value: 'draft',
              label: 'Draft'
            },
            {
              value: 'placed',
              label: 'Placed'
            },
            {
              value: 'pending',
              label: 'Pending'
            },
            {
              value: 'approved',
              label: 'Approved'
            },
            {
              value: 'cancelled',
              label: 'Cancelled'
            }
          ]}
          isMulti
          onSelect={(values) => {
            updateFilters('status_in', flatSelectValues(values))
          }}
        />
      </Spacer>

      <Spacer bottom='6'>
        <InputDateRange
          label='Date range'
          fromDate={parseFilterToDate(filters.created_at_gteq)}
          onFromChange={(date) => {
            updateFilters('created_at_gteq', date.toISOString())
          }}
          toDate={parseFilterToDate(filters.created_at_lteq)}
          onToChange={(date) => {
            updateFilters('created_at_lteq', date.toISOString())
          }}
        />
      </Spacer>
    </div>
  )
}

function parseFilterToDate(filterValue: FilterValue): Date | undefined {
  return filterValue != null && typeof filterValue === 'string'
    ? new Date(filterValue)
    : undefined
}
