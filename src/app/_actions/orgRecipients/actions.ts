'use server'
/** Global search:(STRING) of either firstname | parent_name | recipient id | email */
interface I_getDataFromLTOrg {
  /** Get data based on date */
  fetch_date?: Date
  fetch_all?: boolean
  limit?: number
  searchIds?: string[]
}

export const fetchDataFromLTOrg = async (body: I_getDataFromLTOrg | string) => {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(body),
  }

  return await fetch(
    'https://www.lovetransfusion.org/api/recipients2',
    requestOptions
  )
    .then((response) => response.json()) // Convert response to JSON
    .then((data) => data) // Log the response
    .catch((error) => console.error('Error:', error))
}
