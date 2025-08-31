import ReviewersComponent from '~/challenge/components/reviewers'
import UsersComponent from '~/challenge/components/users'
import type { Route } from './+types/challenge'

export function meta(
  _args: Route.MetaArgs,
): { title?: string; name?: string; content?: string }[] {
  return [
    { title: 'FE Challenge' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export default function ChallengePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Management Dashboard</h1>
        <p className="text-muted-foreground">
          Browse and search through users and reviewers with infinite scrolling
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UsersComponent />
        <ReviewersComponent />
      </div>
    </div>
  )
}