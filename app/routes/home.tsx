import type { Route } from './+types/home'

export function meta(
  _args: Route.MetaArgs,
): { title?: string; name?: string; content?: string }[] {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export default function Home(): React.ReactElement {
  return (
    <div className='p-4 h-screen flex flex-col justify-center items-center'>
      <h1 className='text-2xl text-center mb-8'>Home Page</h1>
    </div>
  )
}
