import { Users } from 'lucide-react'
import UsersSearch from './users-search/UsersSearch'
import UsersList from './users-list/UsersList'
import ListWrapper from '~/challenge/components/list/list-wrapper/ListWrapper'

export default function UsersComponent(): React.ReactElement {

  return (
    <ListWrapper List={UsersList} SearchBox={UsersSearch} title="Users" icon={Users} />
  )
}