import { type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'


interface ListWrapperProps {
  List: React.ComponentType
  SearchBox: React.ComponentType
  title: string
  icon: LucideIcon
}

export default function ListWrapper({ List, SearchBox, title, icon: Icon }: ListWrapperProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <div className="mt-4">
          <SearchBox />
        </div>
      </CardHeader>
      <CardContent>
        <List />
      </CardContent>
    </Card>
  )
}