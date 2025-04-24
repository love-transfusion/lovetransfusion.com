export interface I_Options {
    method: string
    headers: {
      accept: string
      'content-type': string
      'Api-Token'?: string
    }
    body?: string
  }