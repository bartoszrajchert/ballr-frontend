export type GetTeamsResponse = {
  name: string;
  short_name: string;
  is_active: boolean;
  city: {
    name: string;
    id: number;
  };
  id: number;
  creation_date: string;
};

export type GetTeamResponse = {
  name: string;
  short_name: string;
  is_active: boolean;
  city: {
    name: string;
    id: number;
  };
  id: number;
  creation_date: string;
  users: {
    is_captain: boolean;
    start_date: string;
    end_date?: string;
    user_first_name: string;
    user_last_name: string;
    user_id: string;
    user_email: string;
  }[];
  banned_users: {
    start_date: string;
    end_date?: string;
    user_first_name: string;
    user_last_name: string;
    user_id: string;
    user_email: string;
  }[];
};

export type CreateTeamPayload = {
  name: string;
  short_name: string; // Max 5 chars
  city_id: number;
};

export type EditTeamPayload = {
  name: string;
  short_name: string;
  is_active: boolean;
  city_id: number;
  new_captain: string;
};
