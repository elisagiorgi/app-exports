declare module 'Filters' {
  type FilterValue = string | number | Array<string | number> | null

  type Filters<FiltrableField extends string> = Partial<
    Record<FiltrableField, FilterValue>
  >

  type OrderField =
    | 'market_in'
    | 'status_in'
    | 'created_at_gteq'
    | 'created_at_lteq'

  type OrdersFilters = Filters<OrderField>

  type AllFilters = FilterOrders | FilterOrders
}
