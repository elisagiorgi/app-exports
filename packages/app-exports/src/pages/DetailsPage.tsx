import { appRoutes } from '#data/routes'
import {
  useTokenProvider,
  PageSkeleton
} from '@commercelayer/core-app-elements'
import { useRoute } from 'wouter'

const DetailsPage = (): JSX.Element | null => {
  const { sdkClient } = useTokenProvider()
  const [_match, params] = useRoute(appRoutes.details.path)
  const exportId = params == null ? null : params.exportId

  if (exportId == null) {
    return null
  }

  if (sdkClient == null) {
    console.warn('Waiting for SDK client')
    return <PageSkeleton layout='details' hasHeaderDescription />
  }

  return <div>Details page</div>
}

export default DetailsPage
