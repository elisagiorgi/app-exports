import { formatDate, useTokenProvider } from '@commercelayer/app-elements'
import { Export } from '@commercelayer/sdk'

interface Props {
  job: Export
}

export function DescriptionLine({ job }: Props): JSX.Element {
  const {
    settings: { timezone }
  } = useTokenProvider()

  return (
    <>
      {job.status === 'pending' ? (
        <div>Pending</div>
      ) : job.status === 'in_progress' ? (
        <div>In progress</div>
      ) : job.interrupted_at != null ? (
        <div>
          Export failed on {formatDate(job.interrupted_at, false, timezone)}
        </div>
      ) : job.status === 'completed' ? (
        <div>Exported on {formatDate(job.completed_at, false, timezone)}</div>
      ) : (
        '-'
      )}
    </>
  )
}
