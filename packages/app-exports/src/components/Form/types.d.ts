declare module 'AppForm' {
  import { SelectValue } from '@commercelayer/app-elements'

  type ExportFormat = 'csv' | 'json'

  type FilterValue = string | number | Array<string | number> | null | boolean

  type Filters<FiltrableField extends string> = Partial<
    Record<FiltrableField, FilterValue>
  >

  // orders
  type OrdersFilters = Filters<OrdersField>
  type OrdersField =
    | 'market_id_in'
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

  type AllFilters = OrdersFilters & SkusFilters & PricesFilters

  interface ExportFormValues {
    dryData: boolean
    includes: SelectValue[]
    format: ExportFormat
    filters?: AllFilters
  }
}
