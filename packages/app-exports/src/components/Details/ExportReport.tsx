import { Export } from '@commercelayer/sdk'
import { useExportDetailsContext } from './Provider'
import { Report } from '@commercelayer/core-app-elements'
import { ExportCount } from './ExportCount'

export function ExportReport(): JSX.Element | null {
  const {
    state: { data }
  } = useExportDetailsContext()

  if (data == null) {
    return null
  }

  const linkLabel =
    data.format === 'csv' ? 'Download CSV file' : 'Download JSON file'

  return (
    <Report
      items={[
        {
          label: getStatusLabel(data),
          count: <ExportCount type='records_count' />,
          linkUrl: getSourceFileUrl(data),
          linkLabel
        }
      ]}
    />
  )
}

function getStatusLabel(data: Export): string {
  switch (data.status) {
    case 'completed':
      return 'Records exported'

    case 'pending':
      return 'Exporting records'

    case 'in_progress':
      return 'Exporting records'

    default:
      return 'Records'
  }
}

function getSourceFileUrl(job?: Export): string | undefined {
  if (
    job == null ||
    job?.attachment_url == null ||
    job?.records_count == null ||
    job.records_count === 0
  ) {
    return undefined
  }
  return job.attachment_url
}
