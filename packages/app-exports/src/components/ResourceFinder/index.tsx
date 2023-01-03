import { CommerceLayerClient } from '@commercelayer/sdk'
import { useEffect, useState } from 'react'
import {
  fetchInitialResources,
  fetchResourcesByHint,
  SearchableResource
} from './utils'
import { InputSelect, Label } from '@commercelayer/core-app-elements'
import {
  PossibleSelectValue,
  SelectValue
} from '@commercelayer/core-app-elements/dist/types/ui/forms/InputSelect'

interface Props {
  /**
   * Text to show above the input
   */
  label: string
  /**
   * Optional input placeholder
   */
  placeholder?: string
  /**
   * the type of the resource we need to access
   */
  resourceType: SearchableResource
  /**
   * Enables the selection of multiple values
   */
  isMulti?: boolean
  /**
   * A signed SDK client
   */
  sdkClient: CommerceLayerClient
  /**
   * callback function fired when the resource is selected from the list
   */
  onSelect: (value: PossibleSelectValue) => void
}

export function ResourceFinder({
  label,
  placeholder,
  resourceType,
  sdkClient,
  isMulti,
  onSelect
}: Props): JSX.Element {
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<SelectValue[]>([])
  useEffect(() => {
    if (resourceType == null) {
      return
    }
    setIsLoading(true)
    fetchInitialResources(sdkClient, resourceType)
      .then(setInitialValues)
      .finally(() => {
        setIsLoading(false)
      })
  }, [resourceType])

  return (
    <div>
      <Label gap htmlFor='resource-finder'>
        {label}
      </Label>
      <InputSelect
        initialValues={initialValues}
        placeholder={placeholder}
        isLoading={isLoading}
        isMulti={isMulti}
        onSelect={onSelect}
        loadAsyncValues={async (hint) => {
          return await fetchResourcesByHint(sdkClient, hint, resourceType)
        }}
      />
    </div>
  )
}
