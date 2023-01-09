import { SelectValue } from '@commercelayer/core-app-elements/dist/ui/forms/InputSelect'
import { CommerceLayerClient } from '@commercelayer/sdk'
import { ListResponse, Resource } from '@commercelayer/sdk/lib/cjs/resource'

export type SearchableResource = 'markets' | 'skus' | 'price_lists'

export interface SearchParams {
  /**
   * signed sdk client
   */
  sdkClient: CommerceLayerClient
  /**
   * the resource we are requesting
   */
  resourceType: SearchableResource
  /**
   * fields to return in search results
   */
  fields?: string[]
  /**
   * resource filed to be used as value in option item
   */
  fieldForValue?: 'code' | 'id'
  /**
   * resource filed to be used as label in option item
   */
  fieldForLabel?: 'code' | 'name'
}

export const fetchResourcesByHint = async ({
  sdkClient,
  hint,
  resourceType,
  fields = ['name', 'id'],
  fieldForValue,
  fieldForLabel = 'name'
}: SearchParams & {
  hint: string
}): Promise<SelectValue[]> => {
  const fetchedResources = await sdkClient[resourceType].list({
    fields,
    filters: {
      [`${fieldForLabel}_cont`]: hint
    },
    pageSize: 5
  })
  return adaptApiToSuggestions({
    fetchedResources,
    fieldForValue,
    fieldForLabel
  })
}

export const fetchInitialResources = async ({
  sdkClient,
  resourceType,
  fields = ['name', 'id'],
  fieldForValue,
  fieldForLabel
}: SearchParams): Promise<SelectValue[]> => {
  const fetchedResources = await sdkClient[resourceType].list({
    fields,
    pageSize: 25
  })
  return adaptApiToSuggestions({
    fetchedResources,
    fieldForValue,
    fieldForLabel
  })
}

interface AdaptSuggestionsParams
  extends Pick<SearchParams, 'fieldForLabel' | 'fieldForValue'> {
  fetchedResources: ListResponse<
    Resource & { name?: string; code?: string; id: string }
  >
}

function adaptApiToSuggestions({
  fetchedResources,
  fieldForValue = 'id',
  fieldForLabel = 'name'
}: AdaptSuggestionsParams): SelectValue[] {
  console.log(fetchedResources[0].type, 'fieldForValue', fieldForValue)
  return fetchedResources.map((r) => ({
    value: r[fieldForValue] ?? r.id,
    label: r[fieldForLabel] ?? r.id,
    meta: r
  }))
}
