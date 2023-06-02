export type GetUserResponse = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  notification_preference: boolean;
  gender: {
    type: string;
    id: number;
  };
  city: {
    name: string;
    id: number;
  };
  teams: {
    is_captain: boolean;
    start_date: string;
    end_date?: string;
    team_name: string;
    team_id: number;
    team_short_name: string;
  }[];
  matches: [];
  reservations: [];
};