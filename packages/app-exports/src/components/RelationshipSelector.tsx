import { AllowedResourceType } from 'App'
import {
  isResourceWithRelationship,
  getRelationshipsByResourceType
} from '#data/relationships'
import { InputSelect, flatSelectValues } from '@commercelayer/core-app-elements'

interface Props {
  resourceType: AllowedResourceType
  onSelect: (relationships: string[]) => void
}

export function RelationshipSelector({
  resourceType,
  onSelect
}: Props): JSX.Element | null {
  if (!isResourceWithRelationship(resourceType)) {
    return null
  }

  const relationships = getRelationshipsByResourceType(resourceType)

  return (
    <div>
      <InputSelect
        initialValues={relationships.map((r) => ({
          value: r,
          label: r
        }))}
        onSelect={(relationships) => {
          const values = flatSelectValues(relationships)
          if (values == null) {
            onSelect([])
            return
          }
          if (Array.isArray(values)) {
            onSelect(values.map(String))
            return
          }
          if (typeof values === 'string') {
            onSelect([values])
          }
        }}
        isClearable
        isMulti
        helperText='List of relationships to be included in the export.'
        label='Include'
      />
    </div>
  )
}
