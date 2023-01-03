import { ResourceFinder } from '#components/ResourceFinder'
import {
  InputDateRange,
  InputSelect,
  Spacer,
  flatSelectValues,
  useTokenProvider
} from '@commercelayer/core-app-elements'
import { OrderField, OrdersFilters, FilterValue } from 'Filters'
import { useEffect, useState } from 'react'

interface Props {
  onChange: (filters: OrdersFilters) => void
}

export function Orders({ onChange }: Props): JSX.Element | null {
  const { sdkClient } = useTokenProvider()
  const [filters, setFilter] = useState<OrdersFilters>({})

  if (sdkClient == null) {
    return null
  }

  const updateFilters = (key: OrderField, value: FilterValue): void => {
    setFilter((state) => ({
      ...state,
      [key]: value
    }))
  }

  useEffect(
    function dispatchFilterChange() {
      onChange(filters)
    },
    [filters]
  )

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
          autoPlaceholder
          onFromChange={(date) => {
            updateFilters('created_at_gteq', date?.toISOString() ?? null)
          }}
          toDate={parseFilterToDate(filters.created_at_lteq)}
          onToChange={(date) => {
            updateFilters('created_at_lteq', date?.toISOString() ?? null)
          }}
          isClearable
        />
      </Spacer>
    </div>
  )
}

function parseFilterToDate(filterValue?: FilterValue): Date | undefined {
  return filterValue != null && typeof filterValue === 'string'
    ? new Date(filterValue)
    : undefined
}
