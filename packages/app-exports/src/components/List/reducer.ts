import { Export } from '@commercelayer/sdk'
import { ListResponse } from '@commercelayer/sdk/lib/cjs/resource'
import { ListExportContextState } from 'App'

type Action =
  | { type: 'setLoading'; payload: boolean }
  | { type: 'setList'; payload: ListResponse<Export> }
  | { type: 'changePage'; payload: number }
  | { type: 'togglePolling'; payload: boolean }
  | { type: 'sort'; payload: 'asc' | 'desc' }

export const reducer = (
  state: ListExportContextState,
  action: Action
): ListExportContextState => {
  switch (action.type) {
    case 'setLoading':
      return {
        ...state,
        isLoading: action.payload
      }
    case 'setList':
      return {
        ...state,
        list: action.payload
      }
    case 'changePage':
      return {
        ...state,
        currentPage: action.payload
      }
    case 'togglePolling':
      return {
        ...state,
        isPolling: action.payload
      }
    case 'sort':
      return {
        ...state,
        sort: {
          created_at: action.payload
        }
      }
    default:
      return state
  }
}
