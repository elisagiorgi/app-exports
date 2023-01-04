declare module 'Filters' {
  type FilterValue = string | number | Array<string | number> | null

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
    | 'market_in'
    | 'id_in'
    | 'created_at_gteq'
    | 'created_at_lteq'
    | 'do_not_ship_false' // is shippable

  // prices
  type PricesFilters = Filters<PricesField>
  type PricesField = 'sku_id_in' | 'price_list_id_eq'
}
