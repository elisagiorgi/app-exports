import { ResourceFinder } from '#components/ResourceFinder'
import {
  Spacer,
  flatSelectValues,
  useTokenProvider
} from '@commercelayer/core-app-elements'
import { FilterValue, PricesFilters, PricesField } from 'Filters'
import { useEffect, useState } from 'react'

interface Props {
  onChange: (filters: PricesFilters) => void
}

export function Prices({ onChange }: Props): JSX.Element | null {
  const { sdkClient } = useTokenProvider()
  const [filters, setFilter] = useState<PricesFilters>({})

  if (sdkClient == null) {
    return null
  }

  const updateFilters = (key: PricesField, value: FilterValue): void => {
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
          label='SKU codes'
          resourceType='skus'
          isMulti
          onSelect={(values) => {
            updateFilters('sku_id_in', flatSelectValues(values))
          }}
          sdkClient={sdkClient}
        />
      </Spacer>

      <Spacer bottom='6'>
        <ResourceFinder
          label='Price list'
          resourceType='price_lists'
          onSelect={(values) => {
            updateFilters('price_list_id_eq', flatSelectValues(values))
          }}
          sdkClient={sdkClient}
        />
      </Spacer>
    </div>
  )
}
