export type ac_list_types =
  | 'Master Contact List'
  | 'Love Transfusion'
  | 'ORG Website Contacts'
  | 'Commenting Audience'
  | 'New Member'
  | 'New Recipient Notifications'
  | 'Love Transfusion - App Testers'
  | 'Recipient Notifications'
  | 'COM Website Contacts'

type id = `${number}`

interface I_ac_lists {
  name: ac_list_types
  id: id
}

export const ac_lists = {
  getList(name: ac_list_types): I_ac_lists {
    const list: I_ac_lists[] = [
      {
        name: 'Master Contact List',
        id: '1',
      },
      {
        name: 'Love Transfusion',
        id: '3',
      },
      {
        name: 'ORG Website Contacts',
        id: '4',
      },
      {
        name: 'Commenting Audience',
        id: '7',
      },
      {
        name: 'New Member',
        id: '8',
      },
      {
        name: 'New Recipient Notifications',
        id: '9',
      },
      {
        name: 'Love Transfusion - App Testers',
        id: '10',
      },
      {
        name: 'Recipient Notifications',
        id: '11',
      },
      {
        name: 'COM Website Contacts',
        id: '13',
      },
    ]

    return list.find((item) => item.name === name)!
  },
}
