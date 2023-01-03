import { AllowedResourceType } from 'App'
import { Orders } from './Orders'

interface Props {
  resourceType: AllowedResourceType
}

export function Filters({ resourceType }: Props): JSX.Element | null {
  if (resourceType === 'orders') {
    return <Orders />
  }

  return null
}
