import { ErrorNotFound } from '#components/ErrorNotFound'
import { appRoutes } from '#data/routes'
import { Router, Route, Switch } from 'wouter'
import ListPage from './pages/ListPage'
import {
  PageSkeleton,
  TokenProvider,
  ErrorBoundary,
  CoreSdkProvider,
  MetaTags,
  GTMProvider
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
      <TokenProvider
        appSlug='exports'
        kind='exports'
        domain={window.clAppConfig.domain}
        reauthenticateOnInvalidAuth={!isDev}
        loadingElement={<PageSkeleton />}
        devMode={isDev}
        organizationSlug={import.meta.env.PUBLIC_SELF_HOSTED_SLUG}
      >
        <GTMProvider gtmId={window.clAppConfig.gtmId}>
          <MetaTags />
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
        </GTMProvider>
      </TokenProvider>
    </ErrorBoundary>
  )
}

export default App
