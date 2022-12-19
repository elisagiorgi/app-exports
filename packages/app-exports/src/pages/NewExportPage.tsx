import { appRoutes } from '#data/routes'
import {
  useTokenProvider,
  PageSkeleton
} from '@commercelayer/core-app-elements'
import { useRoute } from 'wouter'

const NewExportPage = (): JSX.Element | null => {
  const { sdkClient } = useTokenProvider()
  const [_match, params] = useRoute(appRoutes.details.path)
  const importId = params == null ? null : params.importId

  if (importId == null) {
    return null
  }

  if (sdkClient == null) {
    console.warn('Waiting for SDK client')
    return <PageSkeleton hasHeaderDescription />
  }

  return <div>New export page</div>
}

export default NewExportPage
