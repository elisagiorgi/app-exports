import { AllowedResourceType } from 'App'
import {
  isResourceWithRelationship,
  getRelationshipsByResourceType
} from '#data/relationships'
import { InputSelect } from '@commercelayer/core-app-elements'

interface Props {
  resourceType: AllowedResourceType
}

export function RelationshipSelector({
  resourceType
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
        onSelect={() => {
          //
        }}
        isClearable
        isMulti
        helperText='List of relationships to be included in the export.'
        label='Include'
      />
    </div>
  )
}
