import { ResourceFinder } from '#components/Form/ResourceFinder'
import {
  InputDateRange,
  InputSelect,
  Spacer,
  flatSelectValues,
  useCoreSdkProvider
} from '@commercelayer/core-app-elements'
import { OrdersField, OrdersFilters, FilterValue } from 'AppForm'
import { useEffect, useState } from 'react'

interface Props {
  onChange: (filters: OrdersFilters) => void
}

export function Orders({ onChange }: Props): JSX.Element | null {
  const { sdkClient } = useCoreSdkProvider()
  const [filters, setFilter] = useState<OrdersFilters>({})

  if (sdkClient == null) {
    return null
  }

  const updateFilters = (key: OrdersField, value: FilterValue): void => {
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
    </div>
  )
}

function parseFilterToDate(filterValue?: FilterValue): Date | undefined {
  return filterValue != null && typeof filterValue === 'string'
    ? new Date(filterValue)
    : undefined
}
