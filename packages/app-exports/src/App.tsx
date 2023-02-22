import { RuntimeConfigProvider } from '#components/RuntimeConfigProvider'
import { ErrorNotFound } from '#components/ErrorNotFound'
import { appRoutes } from '#data/routes'
import { Router, Route, Switch } from 'wouter'
import ListPage from './pages/ListPage'
import {
  PageSkeleton,
  TokenProvider,
  ErrorBoundary,
  CoreSdkProvider
} from '@commercelayer/app-elements'
import { ResourceSelectorPage } from './pages/ResourceSelectorPage'
import DetailsPage from './pages/DetailsPage'
import NewExportPage from './pages/NewExportPage'

const isDev = Boolean(import.meta.env.DEV)

function App(): JSX.Element {
  const basePath =
    import.meta.env.PUBLIC_PROJECT_PATH != null
      ? `/${import.meta.env.PUBLIC_PROJECT_PATH}`
      : undefined

  return (
    <ErrorBoundary hasContainer>
      <RuntimeConfigProvider>
        {({ domain }) => (
          <TokenProvider
            currentApp='exports'
            clientKind={import.meta.env.PUBLIC_TOKEN_KIND ?? 'webapp'}
            domain={domain ?? ''}
            reauthenticateOnInvalidAuth={!isDev}
            loadingElement={<PageSkeleton />}
            devMode={isDev}
          >
            <CoreSdkProvider>
              <Router base={basePath}>
                <Switch>
                  <Route path={appRoutes.list.path}>
                    <ListPage />
                  </Route>
                  <Route path={appRoutes.selectResource.path}>
                    <ResourceSelectorPage />
                  </Route>
                  <Route path={appRoutes.newExport.path}>
                    <NewExportPage />
                  </Route>
                  <Route path={appRoutes.details.path}>
                    <DetailsPage />
                  </Route>
                  <Route>
                    <ErrorNotFound />
                  </Route>
                </Switch>
              </Router>
            </CoreSdkProvider>
          </TokenProvider>
        )}
      </RuntimeConfigProvider>
    </ErrorBoundary>
  )
}

export default App
