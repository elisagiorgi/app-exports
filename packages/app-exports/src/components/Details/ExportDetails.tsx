import {
  ListDetailsItem,
  ListDetails,
  BlockCode
} from '@commercelayer/core-app-elements'
import { useExportDetailsContext } from './Provider'
import { StatusBadge } from './StatusBadge'

export function ExportDetails(): JSX.Element | null {
  const {
    state: { data }
  } = useExportDetailsContext()

  if (data == null) {
    return null
  }

  return (
    <ListDetails title='Details'>
      {data.status != null ? (
        <ListDetailsItem label='Status' hasGutter>
          <StatusBadge job={data} />
        </ListDetailsItem>
      ) : null}
      {data.includes != null && data.includes.length > 0 ? (
        <ListDetailsItem label='Includes' hasGutter>
          {data.includes.join(', ')}
        </ListDetailsItem>
      ) : null}
      <ListDetailsItem label='Filters' hasGutter>
        <BlockCode json={data.filters} />
      </ListDetailsItem>
      <ListDetailsItem label='Dry Data' hasGutter>
        {data.dry_data === true ? 'true' : 'false'}
      </ListDetailsItem>
      <ListDetailsItem label='Format' hasGutter>
        {data.format}
      </ListDetailsItem>
    </ListDetails>
  )
}
