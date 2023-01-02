import { useExportDetailsContext } from '#components/Details/Provider'
import { formatDate } from '@commercelayer/core-app-elements'

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  atType: 'started_at' | 'completed_at' | 'interrupted_at'
  prefixText?: string
  includeTime?: boolean
}

export function ExportDate({
  atType,
  prefixText,
  includeTime,
  ...props
}: Props): JSX.Element | null {
  const {
    state: { data }
  } = useExportDetailsContext()

  if (data == null) {
    return null
  }
  return (
    <span {...props}>
      {prefixText} {formatDate(data[atType], includeTime)}
    </span>
  )
}
