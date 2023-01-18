import { ExportedResourceType } from '#components/Details/ExportedResourceType'
import { ExportDetailsProvider } from '#components/Details/Provider'
import { ExportDate } from '#components/Details/ExportDate'
import { ErrorNotFound } from '#components/ErrorNotFound'
import { appRoutes } from '#data/routes'
import {
  useTokenProvider,
  PageSkeleton,
  PageLayout,
  Spacer,
  Button,
  EmptyState
} from '@commercelayer/core-app-elements'
import { useLocation, useRoute, Link } from 'wouter'
import { ExportReport } from '#components/Details/ExportReport'
import { ExportDetails } from '#components/Details/ExportDetails'

const DetailsPage = (): JSX.Element | null => {
  const { sdkClient, canUser, mode } = useTokenProvider()
  const [_match, params] = useRoute(appRoutes.details.path)
  const [_, setLocation] = useLocation()

  const exportId = params == null ? null : params.exportId

  if (exportId == null || !canUser('read', 'exports')) {
    return (
      <PageLayout
        title='Exports'
        onGoBack={() => {
          setLocation(appRoutes.list.makePath())
        }}
        mode={mode}
      >
        <EmptyState
          title='Not authorized'
          action={
            <Link href={appRoutes.list.makePath()}>
              <Button variant='primary'>Go back</Button>
            </Link>
          }
        />
      </PageLayout>
    )
  }

  if (sdkClient == null) {
    console.warn('Waiting for SDK client')
    return <PageSkeleton layout='details' hasHeaderDescription />
  }

  return (
    <ExportDetailsProvider sdkClient={sdkClient} exportId={exportId}>
      {({ state: { isLoading, data } }) =>
        isLoading ? (
          <PageSkeleton layout='details' hasHeaderDescription />
        ) : data == null ? (
          <ErrorNotFound />
        ) : (
          <PageLayout
            title={<ExportedResourceType />}
            mode={mode}
            description={
              <ExportDate
                atType='completed_at'
                prefixText='Imported on '
                includeTime
              />
            }
            onGoBack={() => {
              setLocation(appRoutes.list.makePath())
            }}
          >
            <ExportReport />

            <Spacer bottom='12'>
              <ExportDetails />
            </Spacer>
          </PageLayout>
        )
      }
    </ExportDetailsProvider>
  )
}

export default DetailsPage
