import { CommerceLayerClient, Export } from '@commercelayer/sdk'
import { ListResponse } from '@commercelayer/sdk/lib/cjs/resource'
import { ListExportContextValue, ListExportContextState } from 'App'
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useContext,
  useRef
} from 'react'

import { initialValues, initialState } from './data'
import { reducer } from './reducer'

interface ListExportProviderProps {
  /**
   * Number of items to fetch/load per page.
   */
  pageSize: number
  /**
   * a valid SDK client
   */
  sdkClient: CommerceLayerClient
  /**
   * Inner content where context exists
   */
  children: ((props: ListExportContextValue) => ReactNode) | ReactNode
}
const POLLING_INTERVAL = 4000

const Context = createContext<ListExportContextValue>(initialValues)

export const useListContext = (): ListExportContextValue => useContext(Context)

export function ListExportProvider({
  children,
  pageSize,
  sdkClient
}: ListExportProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState)
  const intervalId = useRef<NodeJS.Timer | null>(null)

  const changePage = useCallback(
    (page: number) => dispatch({ type: 'changePage', payload: page }),
    []
  )

  const fetchList = useCallback(async () => {
    const list = await getAllExports({
      cl: sdkClient,
      state,
      pageSize
    })
    dispatch({ type: 'loadData', payload: list })
  }, [state.currentPage])

  const deleteExport = (exportId: string): void => {
    sdkClient.exports
      .delete(exportId)
      .then(fetchList)
      .catch(() => {
        console.error('Export not found')
      })
  }

  useEffect(
    function handleChangePageIgnoringFirstRender() {
      if (state.list?.meta.currentPage != null) {
        void fetchList()
      }
    },
    [state.currentPage]
  )

  useEffect(
    function init() {
      void fetchList()
      if (!state.isPolling) {
        return
      }
      // start polling
      intervalId.current = setInterval(() => {
        void fetchList()
      }, POLLING_INTERVAL)

      return () => {
        if (intervalId.current != null) {
          clearInterval(intervalId.current)
        }
      }
    },
    [state.isPolling]
  )

  const value: ListExportContextValue = {
    state,
    changePage,
    deleteExport
  }

  return (
    <Context.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </Context.Provider>
  )
}

const getAllExports = async ({
  cl,
  state,
  pageSize
}: {
  cl: CommerceLayerClient
  state: ListExportContextState
  pageSize: number
}): Promise<ListResponse<Export>> => {
  return await cl.exports.list({
    pageNumber: state.currentPage,
    pageSize,
    sort: { created_at: 'desc' }
  })
}
