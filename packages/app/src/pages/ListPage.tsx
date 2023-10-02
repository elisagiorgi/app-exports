import { Item } from '#components/List/Item'
import { ListExportProvider } from '#components/List/Provider'
import { appRoutes } from '#data/routes'
import {
  Button,
  EmptyState,
  List,
  PageLayout,
  PageSkeleton,
  useCoreSdkProvider,
  useTokenProvider
} from '@commercelayer/app-elements'
import { Link, useLocation } from 'wouter'

function ListPage(): JSX.Element {
  const {
    dashboardUrl,
    canUser,
    settings: { mode }
  } = useTokenProvider()
  const { sdkClient } = useCoreSdkProvider()

  const [_location, setLocation] = useLocation()

  if (sdkClient == null) {
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
        window.location.href =
          dashboardUrl != null ? `${dashboardUrl}/hub` : '/'
      }}
    >
      <ListExportProvider sdkClient={sdkClient} pageSize={25}>
        {({ state, changePage }) => {
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
                    <a>New export</a>
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
                return <Item key={job.id} job={job} />
              })}
            </List>
          )
        }}
      </ListExportProvider>
    </PageLayout>
  )
}

export default ListPage
