import { Mail, User, Quote } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { type DefaultItemList as DefaultItemListType } from '~/challenge/schemas/db.schema'
import { memo } from 'react'

interface DefaultItemListProps<T extends DefaultItemListType> {
  data: T
  style?: React.CSSProperties
}

export const DefaultItemList = memo(function DefaultItemList<T extends DefaultItemListType>({ data, style }: DefaultItemListProps<T>) {
  return (
    <Card className="transition-all hover:shadow-md" style={style}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg">
                {data.firstName} {data.lastName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            <a
              href={`mailto:${data.email}`}
              className="hover:text-primary transition-colors"
            >
              {data.email}
            </a>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Quote className="h-3 w-3 text-muted-foreground mt-1 flex-shrink-0" />
              <p className="text-sm italic text-muted-foreground">
                "{data.catchPhrase}"
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="line-clamp-2">{data.comments}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})