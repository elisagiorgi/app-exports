import { ResourceFinder } from '#components/ResourceFinder'
import {
  InputDateRange,
  InputSelect,
  Spacer,
  flatSelectValues,
  useTokenProvider
} from '@commercelayer/core-app-elements'
import { FilterValue, SkusFilters, SkusField } from 'Filters'
import { useEffect, useState } from 'react'

interface Props {
  onChange: (filters: SkusFilters) => void
}

export function Skus({ onChange }: Props): JSX.Element | null {
  const { sdkClient } = useTokenProvider()
  const [filters, setFilter] = useState<SkusFilters>({})

  if (sdkClient == null) {
    return null
  }

  const updateFilters = (key: SkusField, value: FilterValue): void => {
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
        <ResourceFinder
          label='SKU codes'
          resourceType='skus'
          isMulti
          onSelect={(values) => {
            updateFilters('id_in', flatSelectValues(values))
          }}
          sdkClient={sdkClient}
        />
      </Spacer>

      <Spacer bottom='6'>
        <InputSelect
          label='Product Type'
          initialValues={[
            {
              value: 'true',
              label: 'Shippable SKU'
            },
            {
              value: 'false',
              label: 'Non-shippable SKU'
            }
          ]}
          isClearable
          onSelect={(values) => {
            updateFilters('do_not_ship_false', flatSelectValues(values))
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
