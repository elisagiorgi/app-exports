import { AllowedResourceType } from 'App'
import {
  isResourceWithRelationship,
  getRelationshipsByResourceType
} from '#data/relationships'
import { InputSelect, flatSelectValues } from '@commercelayer/core-app-elements'

interface Props {
  resourceType: AllowedResourceType
  onChange: (relationships: string[]) => void
}

export function RelationshipSelector({
  resourceType,
  onChange
}: Props): JSX.Element | null {
  if (!isResourceWithRelationship(resourceType)) {
    return null
  }

  const relationships = getRelationshipsByResourceType(resourceType)

  return (
    <InputSelect
      initialValues={relationships.map((r) => ({
        value: r,
        label: r
      }))}
      onSelect={(relationships) => {
        const values = flatSelectValues(relationships)
        if (values == null) {
          onChange([])
          return
        }
        if (Array.isArray(values)) {
          onChange(values.map(String))
          return
        }
        if (typeof values === 'string') {
          onChange([values])
        }
      }}
      isClearable
      isMulti
      helperText='List of relationships to be included in the export.'
      label='Include'
    />
  )
}
