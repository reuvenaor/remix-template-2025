import { DefaultItemList } from '~/challenge/components/list/default-item-list/DefaultItemList'
import type { Reviewer } from '~/challenge/schemas/db.schema'

interface ReviewerItemProps {
  data: Reviewer
  style?: React.CSSProperties
}

export function ReviewerItem({ data, style }: ReviewerItemProps) {
  return <DefaultItemList data={data} style={style} />
}