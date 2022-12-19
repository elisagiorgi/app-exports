import { ListExportContextValue, ListExportContextState } from 'App'

export const initialState: ListExportContextState = {
  isLoading: true,
  isPolling: false,
  currentPage: 1,
  sort: {
    created_at: 'desc'
  }
}

export const initialValues: ListExportContextValue = {
  state: initialState,
  changePage: () => undefined,
  deleteExport: () => undefined
}
