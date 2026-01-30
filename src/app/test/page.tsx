import React from 'react'

const page = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/cron/recipients`,
    {
      method: 'GET',
      headers: {
        authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
      cache: 'no-store',
    },
  )
  return (
    <div>
      <pre>{JSON.stringify(res, null, 2)}</pre>
    </div>
  )
}

export default page
