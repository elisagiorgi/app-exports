import { appRoutes } from '#data/routes'
import { Link, useLocation } from 'wouter'
import { ListExportProvider } from '#components/List/Provider'
import { getUiStatus } from '#components/List/utils'
import { showResourceNiceName } from '#data/resources'
import {
  A,
  Button,
  PageSkeleton,
  PageLayout,
  List,
  ListItemTask,
  EmptyState,
  useTokenProvider
} from '@commercelayer/core-app-elements'

function ListPage(): JSX.Element {
  const { sdkClient, dashboardUrl } = useTokenProvider()
  const [_location, setLocation] = useLocation()

  if (sdkClient == null) {
    console.warn('Waiting for SDK client')
    return <PageSkeleton />
  }

  return (
    <PageLayout
      title='Exports'
      onGoBack={() => {
        window.location.href = dashboardUrl != null ? dashboardUrl : '/'
      }}
    >
      <ListExportProvider sdkClient={sdkClient} pageSize={25}>
        {({ state, changePage, deleteExport }) => {
          const { isLoading, currentPage, list } = state

          if (isLoading) {
            return <List isLoading />
          }

          if (list == null) {
            return (
              <div>
                <EmptyState title='Unable to load list' />
              </div>
            )
          }

          if (list.length === 0) {
            return (
              <div>
                <EmptyState
                  title='No export yet!'
                  description='Create your first export'
                  action={
                    <Link href={appRoutes.selectResource.makePath()}>
                      <Button variant='primary'>New export</Button>
                    </Link>
                  }
                />
              </div>
            )
          }

          const isRefetching = currentPage !== list.meta.currentPage
          const { recordCount, recordsPerPage, pageCount } = list.meta

          return (
            <List
              isDisabled={isRefetching}
              title='All Exports'
              actionButton={
                <Link href={appRoutes.selectResource.makePath()}>
                  <A>New export</A>
                </Link>
              }
              pagination={{
                recordsPerPage,
                recordCount,
                currentPage,
                onChangePageRequest: changePage,
                pageCount
              }}
            >
              {list.map((job) => {
                const canDelete =
                  job.status === 'pending' || job.status === 'in_progress'
                return (
                  <ListItemTask
                    key={job.id}
                    status={getUiStatus(job.status)}
                    onClick={() => {
                      setLocation(appRoutes.details.makePath(job.id))
                    }}
                    title={showResourceNiceName(job.resource_type)}
                    onCancelRequest={
                      canDelete ? () => deleteExport(job.id) : undefined
                    }
                    description='todo...'
                  />
                )
              })}
            </List>
          )
        }}
      </ListExportProvider>
    </PageLayout>
  )
}

export default ListPage
