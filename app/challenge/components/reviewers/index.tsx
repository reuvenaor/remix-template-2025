import { UserCheck } from 'lucide-react'
import ReviewersList from './reviewers-list/ReviewersList'
import ReviewersSearch from './reviewers-search/ReviewerSearch'
import ListWrapper from '~/challenge/components/list/list-wrapper/ListWrapper'

export default function ReviewersComponent(): React.ReactElement {
  return (
    <ListWrapper List={ReviewersList} SearchBox={ReviewersSearch} title="Reviewers" icon={UserCheck} />
  )
}