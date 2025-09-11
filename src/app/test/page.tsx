import React from 'react'
import { supa_select_facebook_comments } from '../_actions/facebook_comments/actions'
import Pagination from '../components/Pagination'

interface TestPage_Types {
  searchParams: Promise<{ page: string | undefined }>
}

const TestPage = async (props: TestPage_Types) => {
  const { page: stringPage } = await props.searchParams
  const page = parseInt(stringPage ?? '1')
  const { data, count } = await supa_select_facebook_comments({
    clLimit: 1000,
    clCurrentPage: page,
    post_id: '107794902571685_1189562136542428',
  })
  return (
    <>
      <pre>{JSON.stringify(count, null, 2)}</pre>
      <pre>{JSON.stringify(data.length, null, 2)}</pre>
      {data?.map((item) => {
        return <div key={item.comment_id}>{item.message}</div>
      })}
      <Pagination
        clCurrentPage={page.toString()}
        clCount={count}
        clLimit={1000}
        clExistingSearchParams={[{ page: page.toString() }]}
      />
    </>
  )
}

export default TestPage
