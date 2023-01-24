import { AllowedResourceType } from 'App'
import { AllFilters, ExportFormValues, ExportFormat } from 'AppForm'
import { showResourceNiceName } from '#data/resources'
import {
  InputToggleBox,
  Label,
  Spacer,
  Button,
  InputToggleListBox,
  Tabs,
  Tab
} from '@commercelayer/core-app-elements'
import { RelationshipSelector } from '#components/RelationshipSelector'
import { Filters } from '#components/Form/Filters'
import { resourcesWithFilters } from '#components/Form/Filters/index'
import { InputCode } from '#components/Form/Filters/InputCode'
import { useState } from 'react'

interface Props {
  resourceType: AllowedResourceType
  isLoading?: boolean
  initialData: ExportFormValues
  onSubmit: (values: ExportFormValues) => void
}

export function Form({
  isLoading = false,
  resourceType,
  initialData,
  onSubmit
}: Props): JSX.Element {
  const [filters, setFilters] = useState<AllFilters>(initialData.filters)
  const [includes, setIncludes] = useState<string[]>(initialData.includes)
  const [dryData, setDryData] = useState(initialData.dryData)
  const [format, setFormat] = useState<ExportFormat>(initialData.format)

  return (
    <form>
      <Spacer bottom='6'>
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
      </Spacer>

      <Spacer bottom='14'>
        <RelationshipSelector
          resourceType={resourceType}
          onSelect={setIncludes}
        />
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
            onSelect={(value) => setFormat(value as ExportFormat)}
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

      <Button
        variant='primary'
        onClick={() => {
          onSubmit({
            filters,
            includes,
            dryData,
            format
          })
        }}
        disabled={isLoading}
      >
        {isLoading
          ? 'Exporting...'
          : `Export ${showResourceNiceName(resourceType).toLowerCase()}`}
      </Button>
    </form>
  )
}
