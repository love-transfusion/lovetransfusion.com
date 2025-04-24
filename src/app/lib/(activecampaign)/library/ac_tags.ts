export type ac_tag_types =
  | 'purchased_membership'
  | 'notify_me_of_new_recipients'
  | 'member'
  | 'app_tester'
  | 'emailsequence:completed'
  | 'route:webinar'
  | 'route:plf'
  | 'webinar:watched'
  | 'plf:started'
  | 'test'
type id = `${number}`

interface I_ac_tags {
  name: ac_tag_types
  id: id
}

export const ac_tags = {
  getTag(name: ac_tag_types): I_ac_tags {
    const list: I_ac_tags[] = [
      {
        name: 'purchased_membership',
        id: '1',
      },
      {
        name: 'notify_me_of_new_recipients',
        id: '2',
      },
      {
        name: 'member',
        id: '3',
      },
      {
        name: 'app_tester',
        id: '4',
      },
      {
        name: 'emailsequence:completed',
        id: '5',
      },
      {
        name: 'route:webinar',
        id: '6',
      },
      {
        name: 'route:plf',
        id: '7',
      },
      {
        name: 'webinar:watched',
        id: '8',
      },
      {
        name: 'plf:started',
        id: '9',
      },
      {
        name: 'test',
        id: '15',
      },
    ]
    return list.find((item) => item.name === name)!
  },
}
