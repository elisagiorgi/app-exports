import { isAvailableResource, showResourceNiceName } from '#data/resources'
import { appRoutes } from '#data/routes'
import {
  useTokenProvider,
  PageSkeleton,
  PageLayout,
  PageError,
  InputToggleBox,
  Label,
  Spacer,
  Button,
  Text,
  InputToggleListBox,
  Tabs,
  Tab
} from '@commercelayer/core-app-elements'
import { useLocation, useRoute } from 'wouter'
import { RelationshipSelector } from '#components/RelationshipSelector'
import { useEffect, useState } from 'react'
import { ApiError } from 'App'
import { Filters } from '#components/Filters'
import { AllFilters } from 'Filters'
import { resourcesWithFilters } from '#components/Filters/index'
import { InputCode } from '#components/Filters/InputCode'
import { validateRecordsCount } from '#utils/validateRecordsCount'
import { parseApiError } from '#utils/apiErrors'

const NewExportPage = (): JSX.Element | null => {
  const { sdkClient } = useTokenProvider()
  const [_match, params] = useRoute(appRoutes.newExport.path)
  const [_location, setLocation] = useLocation()

  const [apiError, setApiError] = useState<ApiError[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const [filters, setFilters] = useState<AllFilters>()
  const [dryData, setDryData] = useState(false)
  const [format, setFormat] = useState('json')

  const resourceType = params?.resourceType
  if (!isAvailableResource(resourceType)) {
    return <PageError errorName='Invalid resource' errorDescription='' />
  }

  if (sdkClient == null) {
    console.warn('Waiting for SDK client')
    return <PageSkeleton hasHeaderDescription />
  }

  const createExportTask = async (): Promise<void> => {
    setApiError(undefined)
    setIsLoading(true)

    try {
      await validateRecordsCount({
        sdkClient,
        resourceType,
        filters
      })
      await sdkClient.exports.create({
        resource_type: resourceType,
        dry_data: dryData,
        format,
        filters
      })
      setLocation(appRoutes.list.makePath())
    } catch (error) {
      setApiError(parseApiError(error))
      setIsLoading(false)
    }
  }

  const hasApiError = apiError != null && apiError.length > 0

  useEffect(
    function clearApiError() {
      if (hasApiError) {
        setApiError(undefined)
      }
    },
    [filters, dryData, format]
  )

  return (
    <PageLayout
      title={`Export ${showResourceNiceName(resourceType).toLowerCase()}`}
      onGoBack={() => {
        setLocation(appRoutes.selectResource.makePath())
      }}
    >
      <Tabs keepAlive>
        {resourcesWithFilters.includes(resourceType) ? (
          <Tab name='Filters'>
            <Filters resourceType={resourceType} onChange={setFilters} />
          </Tab>
        ) : null}
        <Tab name='Custom rules'>
          <InputCode
            onDataReady={setFilters}
            onDataResetRequest={() => setFilters(undefined)}
          />
        </Tab>
      </Tabs>

      <Spacer bottom='14'>
        <RelationshipSelector resourceType={resourceType} />
      </Spacer>

      <Spacer bottom='14'>
        <Label gap htmlFor='toggle-cleanup'>
          More options
        </Label>
        <div>
          <InputToggleBox
            id='toggle-cleanup'
            label='Dry data to make importable'
            isChecked={dryData}
            onToggle={setDryData}
          />
          <InputToggleListBox
            id='format'
            label='Export format'
            value={format}
            onSelect={setFormat}
            options={[
              { label: 'JSON', value: 'json' },
              {
                label: 'CSV',
                value: 'csv'
              }
            ]}
          />
        </div>
      </Spacer>

      <Spacer bottom='14'>
        <Button
          variant='primary'
          onClick={() => {
            // TODO: validate (?)
            void createExportTask()
          }}
          disabled={isLoading}
        >
          {isLoading
            ? 'Importing...'
            : `Exporting ${showResourceNiceName(resourceType).toLowerCase()}`}
        </Button>
        {hasApiError ? (
          <div>
            {apiError.map((error, idx) => (
              <Text variant='danger' key={idx}>
                {error.title}
              </Text>
            ))}
          </div>
        ) : null}
      </Spacer>
    </PageLayout>
  )
}

export default NewExportPage
