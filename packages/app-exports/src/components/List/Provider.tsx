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
  pageSize: number
  children: ((props: ListExportContextValue) => ReactNode) | ReactNode
  sdkClient: CommerceLayerClient
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

  const fetchList = useCallback(
    async ({ handleLoadingState }: { handleLoadingState: boolean }) => {
      handleLoadingState && dispatch({ type: 'setLoading', payload: true })
      try {
        const list = await getAllExports({
          cl: sdkClient,
          state,
          pageSize
        })
        dispatch({ type: 'setList', payload: list })
      } finally {
        handleLoadingState && dispatch({ type: 'setLoading', payload: false })
      }
    },
    [state.currentPage]
  )

  const deleteExport = (exportId: string): void => {
    sdkClient.exports
      .delete(exportId)
      .catch(() => {
        console.error('Export not found')
      })
      .finally(() => {
        void fetchList({ handleLoadingState: false })
      })
  }

  useEffect(
    function handleChangePageSkippingFirstRender() {
      if (state.list?.meta.currentPage != null) {
        void fetchList({ handleLoadingState: false })
      }
    },
    [state.currentPage]
  )

  useEffect(
    function handlePollingState() {
      if (state.list == null || state.list.length === 0) {
        return
      }

      const shouldPoll = state.list.some((job) =>
        statusForPolling.includes(job.status)
      )
      dispatch({ type: 'togglePolling', payload: shouldPoll })
    },
    [state.list]
  )

  useEffect(
    function startPolling() {
      void fetchList({ handleLoadingState: true })
      if (!state.isPolling) {
        return
      }
      // start polling
      intervalId.current = setInterval(() => {
        void fetchList({ handleLoadingState: false })
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
    sort: state.sort
  })
}

const statusForPolling: Array<Export['status']> = ['pending', 'in_progress']
