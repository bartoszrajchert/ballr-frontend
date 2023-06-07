import { City, Gender } from '@/models/base.model';

export type GetMatchesResponse = {
  match: {
    for_team_only: boolean;
    description: string;
    num_of_players: number;
    open_for_referee: boolean;
    score?: number;
    opponent_score?: number;
    reservation: {
      start_time: string;
      end_time: string;
      is_paid: boolean;
      is_approved: boolean;
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
          city: City;
          id: number;
        };
        id: number;
      };
      id: number;
      user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        birth_date: string;
        notification_preference: boolean;
        gender: Gender;
        city: City;
      };
    };
    id: number;
    // tournament: null;
    // tournament_phase: null;
    team: {
      name: string;
      short_name: string;
      is_active: boolean;
      city: City;
      id: number;
      creation_date: string;
    };
    opponent_team: {
      name: string;
      short_name: string;
      is_active: boolean;
      city: City;
      id: number;
      creation_date: string;
    };
    winner_team?: {
      name: string;
      short_name: string;
      is_active: boolean;
      city: City;
      id: number;
      creation_date: string;
    };
  };
  benefits: string[];
  signed_users: number;
};

export type GetMatchResponse = {
  start_date: string;
  for_team_only: boolean;
  description: string;
  num_of_players: number;
  open_for_referee: boolean;
  score?: number;
  opponent_score?: number;
  reservation: {
    start_time: string;
    end_time: string;
    is_paid: boolean;
    is_approved: boolean;
    user: {
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
    };
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
          id: 1;
        };
        id: 1;
      };
      id: 1;
    };
    id: 1;
  };
  id: 1;
  // tournament: null;
  // tournament_phase: null;
  team?: {
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
  opponent_team?: {
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
  winner_team?: number;
  users: {
    is_player: boolean;
    is_match_creator: boolean;
    is_referee: boolean;
    is_mvp: boolean;
    voted: boolean;
    combined_rating: number;
    user_id: string;
    user_name: string;
    user_last_name: string;
    user_score: number;
    user_email: string;
  }[];
  weather: {
    temp: number;
    description: string;
  };
  benefits: string[];
  signed_users: number;
};

export type PutRatePlayerType = {
  user_id: string;
  rating: number;
  is_mvp: boolean;
};

export type CreateMatchPayload = {
  for_team_only: boolean;
  description: string;
  num_of_players?: number;
  open_for_referee: boolean;
  reservation_id: number;
};

export type UpdateMatchPayload = Partial<
  Omit<CreateMatchPayload, 'reservation_id'>
>;
