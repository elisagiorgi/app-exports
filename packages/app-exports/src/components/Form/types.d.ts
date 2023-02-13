declare module 'AppForm' {
  import { SelectValue } from '@commercelayer/core-app-elements'

  type FilterValue = string | number | Array<string | number> | null | boolean

  type Filters<FiltrableField extends string> = Partial<
    Record<FiltrableField, FilterValue>
  >
  type AllFilters = FilterOrders | FilterOrders

  // orders
  type OrdersFilters = Filters<OrdersField>
  type OrdersField =
    | 'market_in'
    | 'status_in'
    | 'created_at_gteq'
    | 'created_at_lteq'

  // skus
  type SkusFilters = Filters<SkusField>
  type SkusField =
    | 'code_in'
    | 'created_at_gteq'
    | 'created_at_lteq'
    | 'do_not_ship_false' // is shippable

  // prices
  type PricesFilters = Filters<PricesField>
  type PricesField = 'sku_code_in' | 'price_list_id_eq'

  type ExportFormat = 'csv' | 'json'

  interface ExportFormValues {
    dryData: boolean
    includes: SelectValue[]
    format: ExportFormat
    filters?: AllFilters
  }
}
