import { Export } from '@commercelayer/sdk'
import { ListResponse } from '@commercelayer/sdk/lib/cjs/resource'

declare module 'App' {
  export interface ListExportContextValue {
    state: ListExportContextState
    changePage: (page: number) => void
    deleteExport: (id: string) => void
  }

  export interface ListExportContextState {
    list?: ListResponse<Export>
    isLoading: boolean
    isPolling: boolean
    currentPage: number
  }
}
