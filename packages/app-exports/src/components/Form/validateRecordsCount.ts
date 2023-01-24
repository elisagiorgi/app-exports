import { CommerceLayerClient } from '@commercelayer/sdk'
import { AllowedResourceType } from 'App'
import { AllFilters } from 'AppForm'

const MAX_EXPORTABLE_RECORDS = 10_000

export async function validateRecordsCount({
  sdkClient,
  resourceType,
  filters
}: {
  sdkClient: CommerceLayerClient
  resourceType: AllowedResourceType
  filters: AllFilters
}): Promise<void> {
  const list = await sdkClient[resourceType].list({ filters })
  if (list.meta.recordCount > MAX_EXPORTABLE_RECORDS) {
    throw Error(
      `Export size must not exceed ${MAX_EXPORTABLE_RECORDS} records. Please refine your filters.`
    )
  }
  if (list.meta.recordCount === 0) {
    throw Error(
      'No records found for selected combination of resource and filters'
    )
  }
}
