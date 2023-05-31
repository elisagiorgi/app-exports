import {
  type ExportDetailsContextState,
  type ExportDetailsContextValue
} from 'App'

export const initialState: ExportDetailsContextState = {
  isLoading: true,
  isPolling: false,
  isDeleting: false,
  isNotFound: false
}

export const initialValues: ExportDetailsContextValue = {
  state: initialState,
  refetch: async () => undefined,
  deleteExport: async () => false
}
