import { AllowedResourceType } from 'App'
import { ExportFormValues } from 'AppForm'
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
import { RelationshipSelector } from './RelationshipSelector'
import { Filters } from '#components/Form/Filters'
import { resourcesWithFilters } from '#components/Form/Filters/index'
import { InputCode } from '#components/Form/Filters/InputCode'
import { Controller, useForm } from 'react-hook-form'

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
  const { register, control, handleSubmit } = useForm<ExportFormValues>({
    defaultValues: initialData
  })

  const doSubmit = handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <form
      onSubmit={(e) => {
        void doSubmit(e)
      }}
    >
      <Spacer bottom='6'>
        <Tabs keepAlive>
          {resourcesWithFilters.includes(resourceType) ? (
            <Tab name='Filters'>
              <Controller
                name='filters'
                control={control}
                render={({ field: { onChange } }) => (
                  <Filters resourceType={resourceType} onChange={onChange} />
                )}
              />
            </Tab>
          ) : null}
          <Tab name='Custom rules'>
            <Controller
              name='filters'
              control={control}
              render={({ field: { onChange } }) => (
                <InputCode
                  onDataReady={onChange}
                  onDataResetRequest={() => onChange(undefined)}
                />
              )}
            />
          </Tab>
        </Tabs>
      </Spacer>

      <Spacer bottom='14'>
        <Controller
          name='includes'
          control={control}
          render={({ field: { onChange } }) => (
            <RelationshipSelector
              resourceType={resourceType}
              onChange={onChange}
            />
          )}
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
            {...register('dryData')}
          />
          <InputToggleListBox
            id='format'
            label='Export format'
            options={[
              { label: 'JSON', value: 'json' },
              {
                label: 'CSV',
                value: 'csv'
              }
            ]}
            {...register('format')}
          />
        </div>
      </Spacer>

      <Button variant='primary' type='submit' disabled={isLoading}>
        {isLoading
          ? 'Exporting...'
          : `Export ${showResourceNiceName(resourceType).toLowerCase()}`}
      </Button>
    </form>
  )
}
