import axios from 'axios'

const TestPage = async () => {
  const { data } = await axios.post(
    'http://localhost:3001/api/recipients',
    { action: 'test', note: 'Hello from lt.com' },
    {
      headers: {
        'Content-Type': 'application/json',
        'secret-key': process.env.LT_ORG_ROUTE_SECRET_KEY!,
      },
    }
  )
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default TestPage
