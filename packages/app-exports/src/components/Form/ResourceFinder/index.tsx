import { useEffect, useState } from 'react'
import { fetchInitialResources, fetchResourcesByHint } from './utils'
import { InputSelect, Label } from '@commercelayer/app-elements'
import {
  PossibleSelectValue,
  SelectValue
} from '@commercelayer/app-elements/dist/ui/forms/InputSelect'
import { SearchParams } from '#components/Form/ResourceFinder/utils'

interface Props extends SearchParams {
  /**
   * Text to show above the input
   */
  label: string
  /**
   * Optional input placeholder
   */
  placeholder?: string
  /**
   * Enables the selection of multiple values
   */
  isMulti?: boolean
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
  onSelect,
  fields,
  fieldForValue,
  fieldForLabel
}: Props): JSX.Element {
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<SelectValue[]>([])
  useEffect(() => {
    if (resourceType == null) {
      return
    }
    setIsLoading(true)
    fetchInitialResources({
      sdkClient,
      resourceType,
      fields,
      fieldForValue,
      fieldForLabel
    })
      .then(setInitialValues)
      .finally(() => {
        setIsLoading(false)
      })
  }, [resourceType])

  return (
    <div>
      <Label gap>{label}</Label>
      <InputSelect
        initialValues={initialValues}
        placeholder={placeholder}
        isLoading={isLoading}
        isMulti={isMulti}
        isClearable
        onSelect={onSelect}
        loadAsyncValues={async (hint) => {
          return await fetchResourcesByHint({
            sdkClient,
            hint,
            resourceType,
            fields,
            fieldForValue,
            fieldForLabel
          })
        }}
      />
    </div>
  )
}
