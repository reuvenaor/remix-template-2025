import { DefaultItemList } from '~/challenge/components/list/default-item-list/DefaultItemList'
import type { User as UserType } from '~/challenge/schemas/db.schema'


export function UserItem({ data, style }: { data: UserType, style?: React.CSSProperties }) {
  return <DefaultItemList data={data} style={style} />
}