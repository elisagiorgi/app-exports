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
  InputToggleListBox
} from '@commercelayer/core-app-elements'
import { useLocation, useRoute } from 'wouter'
import { RelationshipSelector } from '#components/RelationshipSelector'
import { useState } from 'react'
import { CommerceLayerStatic } from '@commercelayer/sdk'
import { ApiError } from 'App'

const NewExportPage = (): JSX.Element | null => {
  const { sdkClient } = useTokenProvider()
  const [_match, params] = useRoute(appRoutes.newExport.path)
  const [_location, setLocation] = useLocation()

  const [apiError, setApiError] = useState<ApiError[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

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
      await sdkClient.exports.create({
        resource_type: resourceType,
        dry_data: dryData,
        format,
        filters: []
      })
      setLocation(appRoutes.list.makePath())
    } catch (err: any) {
      if (CommerceLayerStatic.isApiError(err) && Array.isArray(err.errors)) {
        console.log(err.errors)
        setApiError(err.errors)
      } else {
        setApiError([
          {
            title: 'Could not create the export task'
          }
        ])
      }
      setIsLoading(false)
    }
  }

  return (
    <PageLayout
      title={`Export ${showResourceNiceName(resourceType).toLowerCase()}`}
      onGoBack={() => {
        setLocation(appRoutes.selectResource.makePath())
      }}
    >
      <div>Filters...</div>

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
        {apiError != null && apiError.length > 0 ? (
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
