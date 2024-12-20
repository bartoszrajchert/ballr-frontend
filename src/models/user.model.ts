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
    is_banned: boolean;
    start_date: string;
    end_date?: string;
    team_name: string;
    team_id: number;
    team_short_name: string;
  }[];
  matches: {
    is_match_creator: boolean;
    is_referee: boolean;
    is_mvp: boolean;
    voted: boolean;
    combined_rating: number;
    match_id: number;
    match_description: string;
    field: {
      name: string;
      length: number;
      width: number;
      roof: boolean;
      facility: {
        name: string;
        street: string;
        postcode: string;
        street_number: number;
        is_verified: boolean;
        open_time: string;
        close_time: string;
        city: {
          name: string;
          id: number;
        };
        id: number;
      };
      id: number;
    };
  }[];
  reservations: {
    start_time: string;
    end_time: string;
    is_paid: boolean;
    is_approved: boolean;
    match_id?: number;
    field: {
      name: string;
      length: number;
      width: number;
      roof: boolean;
      facility: {
        name: string;
        street: string;
        postcode: string;
        street_number: number;
        is_verified: boolean;
        open_time: string;
        close_time: string;
        city: {
          name: string;
          id: number;
        };
        id: number;
      };
      id: number;
    };
    reservation_id: number;
  }[];
};

export type CreateUpdateUserData = {
  first_name: string;
  last_name: string;
  birth_date: string; // Backend doesn't have update for this field
  notification_preference: boolean;
  gender_id: number;
  city_id: number;
};
