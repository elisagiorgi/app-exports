import { useExportDetailsContext } from '#components/Details/Provider'
import { showResourceNiceName } from '#data/resources'

interface Props extends React.HTMLAttributes<HTMLSpanElement> {}

export function ExportedResourceType(props: Props): JSX.Element | null {
  const {
    state: { data }
  } = useExportDetailsContext()

  if (data == null) {
    return null
  }

  return <span {...props}>{showResourceNiceName(data?.resource_type)}</span>
}
