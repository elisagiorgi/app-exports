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
        <ListDetailsItem label='Status'>
          <StatusBadge job={data} />
        </ListDetailsItem>
      ) : null}
      {data.includes != null && data.includes.length > 0 ? (
        <ListDetailsItem label='Includes'>
          {data.includes.join(', ')}
        </ListDetailsItem>
      ) : null}
      <ListDetailsItem label='Filters'>
        <BlockCode json={data.filters} />
      </ListDetailsItem>
      <ListDetailsItem label='Dry Data'>
        {data.dry_data === true ? 'true' : 'false'}
      </ListDetailsItem>
      <ListDetailsItem label='Format'>{data.format}</ListDetailsItem>
    </ListDetails>
  )
}
