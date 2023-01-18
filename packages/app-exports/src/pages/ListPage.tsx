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
import { DescriptionLine } from '#components/List/ItemDescriptionLine'

function ListPage(): JSX.Element {
  const { sdkClient, dashboardUrl, canUser, mode } = useTokenProvider()
  const [_location, setLocation] = useLocation()

  if (sdkClient == null) {
    console.warn('Waiting for SDK client')
    return <PageSkeleton />
  }

  if (!canUser('read', 'exports')) {
    return (
      <PageLayout
        title='Exports'
        mode={mode}
        onGoBack={() => {
          setLocation(appRoutes.list.makePath())
        }}
      >
        <EmptyState title='You are not authorized' />
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title='Exports'
      mode={mode}
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
                    canUser('create', 'exports') ? (
                      <Link href={appRoutes.selectResource.makePath()}>
                        <Button variant='primary'>New export</Button>
                      </Link>
                    ) : undefined
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
                canUser('create', 'exports') ? (
                  <Link href={appRoutes.selectResource.makePath()}>
                    <A>New export</A>
                  </Link>
                ) : undefined
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
                  (job.status === 'pending' || job.status === 'in_progress') &&
                  canUser('destroy', 'exports')
                const statusUi = getUiStatus(job.status)
                return (
                  <ListItemTask
                    key={job.id}
                    status={statusUi}
                    onClick={() => {
                      setLocation(appRoutes.details.makePath(job.id))
                    }}
                    progressPercentage={statusUi === 'progress' ? 0 : undefined}
                    title={showResourceNiceName(job.resource_type)}
                    onCancelRequest={
                      canDelete ? () => deleteExport(job.id) : undefined
                    }
                    description={<DescriptionLine job={job} />}
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
