import { AllowedResourceType } from 'App'
import { Orders } from './Orders'
import { AllFilters } from 'Filters'

interface Props {
  resourceType: AllowedResourceType
  onChange: (filters: AllFilters) => void
}

export function Filters({ resourceType, onChange }: Props): JSX.Element | null {
  if (resourceType === 'orders') {
    return <Orders onChange={onChange} />
  }

  return null
}
