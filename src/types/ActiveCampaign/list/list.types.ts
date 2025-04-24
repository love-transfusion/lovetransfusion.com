export interface ListLinks {
    contactGoalLists: string;
    user: string;
    addressLists: string;
  }
  
  export interface I_ac_List {
    stringid: string;
    userid: string;
    name: string;
    cdate: string;
    p_use_tracking: string;
    p_use_analytics_read: string;
    p_use_analytics_link: string;
    p_use_twitter: string;
    p_use_facebook: string;
    p_embed_image: string;
    p_use_captcha: string;
    send_last_broadcast: string;
    private: string;
    analytics_domains: string | null;
    analytics_source: string;
    analytics_ua: string;
    twitter_token: string;
    twitter_token_secret: string;
    facebook_session: string | null;
    carboncopy: string | null;
    subscription_notify: string | null;
    unsubscription_notify: string | null;
    require_name: string;
    get_unsubscribe_reason: string;
    to_name: string;
    optinoptout: string;
    sender_name: string;
    sender_addr1: string;
    sender_addr2: string;
    sender_city: string;
    sender_state: string;
    sender_zip: string;
    sender_country: string;
    sender_phone: string;
    sender_url: string;
    sender_reminder: string;
    fulladdress: string;
    optinmessageid: string;
    optoutconf: string;
    deletestamp: string | null;
    udate: string | null;
    links: ListLinks;
    id: string;
    user: string;
  }
  
  export interface I_ac_ListsResponseMeta {
    total: string;
  }
  
  export interface I_ac_ListsResponse {
    lists: I_ac_List[];
    meta: I_ac_ListsResponseMeta;
  }
  