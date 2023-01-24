import { ResourceFinder } from '#components/Form/ResourceFinder'
import {
  InputDateRange,
  RadioButtons,
  Spacer,
  flatSelectValues,
  useCoreSdkProvider
} from '@commercelayer/core-app-elements'
import { FilterValue, SkusFilters, SkusField } from 'AppForm'
import { useEffect, useState } from 'react'

interface Props {
  onChange: (filters: SkusFilters) => void
}

export function Skus({ onChange }: Props): JSX.Element | null {
  const { sdkClient } = useCoreSdkProvider()
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
            updateFilters('code_in', flatSelectValues(values))
          }}
          sdkClient={sdkClient}
          fields={['id', 'name', 'code']}
          fieldForLabel='code'
          fieldForValue='code'
        />
      </Spacer>

      <Spacer bottom='6'>
        <RadioButtons
          id='product-type'
          label='Product Type'
          options={[
            {
              value: 'true',
              label: 'Shippable SKU'
            },
            {
              value: 'false',
              label: 'Non-shippable SKU'
            }
          ]}
          value={
            filters.do_not_ship_false == null
              ? undefined
              : (filters.do_not_ship_false as string)
          }
          onChange={(value) => {
            updateFilters('do_not_ship_false', value)
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
