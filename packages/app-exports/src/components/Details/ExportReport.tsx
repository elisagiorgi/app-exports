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
          label: 'Records exported',
          count: <ExportCount type='records_count' />,
          linkUrl: getSourceFileUrl(data),
          linkLabel
        }
      ]}
    />
  )
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
