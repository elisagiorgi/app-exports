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
  Button
} from '@commercelayer/core-app-elements'
import { useLocation, useRoute } from 'wouter'
import { RelationshipSelector } from '#components/RelationshipSelector'
import { useState } from 'react'

const NewExportPage = (): JSX.Element | null => {
  const { sdkClient } = useTokenProvider()
  const [_match, params] = useRoute(appRoutes.newExport.path)
  const [_location, setLocation] = useLocation()

  const [isTouched, setIsTouched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dryData, setDryData] = useState(false)

  const resourceType = params?.resourceType
  if (!isAvailableResource(resourceType)) {
    return <PageError errorName='Invalid resource' errorDescription='' />
  }

  if (sdkClient == null) {
    console.warn('Waiting for SDK client')
    return <PageSkeleton hasHeaderDescription />
  }

  const createExportTask = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await sdkClient.exports.create({
        resource_type: resourceType,
        dry_data: dryData,
        filters: []
      })
      setLocation(appRoutes.list.makePath())
    } catch {
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
        </div>
      </Spacer>

      <Spacer bottom='14'>
        <Button
          variant='primary'
          onClick={() => {
            setIsTouched(true)
            // todo: validate
            void createExportTask()
          }}
          disabled={isLoading}
        >
          {isLoading
            ? 'Importing...'
            : `Exporting ${showResourceNiceName(resourceType).toLowerCase()}`}
        </Button>
      </Spacer>
    </PageLayout>
  )
}

export default NewExportPage
