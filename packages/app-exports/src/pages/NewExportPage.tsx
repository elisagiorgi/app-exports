import { Form } from '#components/Form'
import { adaptFormFiltersToSdk } from '#components/Form/Filters/utils'
import { validateRecordsCount } from '#components/Form/validateRecordsCount'
import { isAvailableResource, showResourceNiceName } from '#data/resources'
import { appRoutes } from '#data/routes'
import { parseApiError } from '#utils/apiErrors'
import {
  Button,
  EmptyState,
  InputFeedback,
  PageError,
  PageLayout,
  PageSkeleton,
  Spacer,
  useCoreSdkProvider,
  useTokenProvider
} from '@commercelayer/app-elements'
import { type ApiError } from 'App'
import { type ExportFormValues } from 'AppForm'
import { useState } from 'react'
import { Link, useLocation, useRoute } from 'wouter'

const NewExportPage = (): JSX.Element | null => {
  const {
    canUser,
    settings: { mode },
    user
  } = useTokenProvider()
  const { sdkClient } = useCoreSdkProvider()

  const [_match, params] = useRoute(appRoutes.newExport.path)
  const [_location, setLocation] = useLocation()

  const [apiError, setApiError] = useState<ApiError[] | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const resourceType = params?.resourceType
  if (!isAvailableResource(resourceType)) {
    return <PageError errorName='Invalid resource' errorDescription='' />
  }

  if (sdkClient == null) {
    return <PageSkeleton hasHeaderDescription />
  }

  if (!canUser('create', 'exports')) {
    return (
      <PageLayout
        title='Exports'
        mode={mode}
        onGoBack={() => {
          setLocation(appRoutes.list.makePath())
        }}
      >
        <EmptyState
          title='You are not authorized'
          action={
            <Link href={appRoutes.list.makePath()}>
              <Button variant='primary'>Go back</Button>
            </Link>
          }
        />
      </PageLayout>
    )
  }

  const createExportTask = async (values: ExportFormValues): Promise<void> => {
    setApiError(undefined)
    setIsLoading(true)

    try {
      const filters = adaptFormFiltersToSdk(values.filters, user?.timezone)
      await validateRecordsCount({
        sdkClient,
        resourceType,
        filters
      })
      await sdkClient.exports.create({
        resource_type: resourceType,
        dry_data: values.dryData,
        includes: values.includes,
        format: values.format,
        filters
      })
      setLocation(appRoutes.list.makePath())
    } catch (error) {
      setApiError(parseApiError(error))
      setIsLoading(false)
    }
  }

  const hasApiError = apiError != null && apiError.length > 0

  return (
    <PageLayout
      title={`Export ${showResourceNiceName(resourceType).toLowerCase()}`}
      mode={mode}
      onGoBack={() => {
        setLocation(appRoutes.selectResource.makePath())
      }}
    >
      <Spacer bottom='14'>
        <Form
          resourceType={resourceType}
          isLoading={isLoading}
          defaultValues={{
            dryData: false,
            format: 'json',
            includes: []
          }}
          onSubmit={(values) => {
            void createExportTask(values)
          }}
        />
        {hasApiError ? (
          <Spacer top='2'>
            {apiError.map((error, idx) => (
              <InputFeedback
                variant='danger'
                key={idx}
                message={error.detail}
              />
            ))}
          </Spacer>
        ) : null}
      </Spacer>
    </PageLayout>
  )
}

export default NewExportPage
