/**
 * DEPRECATED
 */

interface Gender {
  id: number;
  type: string;
}

interface City {
  id: number;
  name: string;
}

interface Benefit {
  id: number;
  name: string;
}

// TODO: Delete
// interface User {
//   id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   birth_date: string;
//   // score: number;
//   // is_admin: boolean;
//   // referee: boolean;
//   notification_preference: boolean;
//   // gender_id: number;
//   // city_id: number;
//   gender?: Gender;
//   city?: City;
//   teams?: Team[];
//   matches?: Match[];
//   reservations?: Reservation[];
// }

interface Facility {
  name: string;
  street: string;
  postcode: string;
  street_number: number;
  is_verified: boolean;
  open_time: string;
  close_time: string;
  city: City;
  id: number;

  fields?: Field[]; // By id
  benefits?: Benefit[]; // By id
}

interface BenefitFacility {
  benefit_id: number;
  facility_id: number;
  benefit?: Benefit;
  facility?: Facility;
}

interface Field {
  id: number;
  name: string;
  length: number;
  width: number;
  roof: boolean;
  facility_id: number;
  facility?: Facility;
}

// TODO: Delete
interface Reservation {
  id: number;
  start_time: string;
  end_time: string;
  is_approved: boolean;
  is_paid: boolean;
  benefit_card: string;
  user_id: number;
  field_id: number;
  // user?: User;
  field?: Field;
}

interface TournamentPhase {
  id: number;
  phase: string;
}

interface Tournament {
  id: number;
  name: string;
  start_date: string;
  registry_end_date: string;
  max_number_of_teams: number;
  creator_id: number;
  city_id: number;
  tournament_phase_id: number;
  city?: City;
  tournamentPhase?: TournamentPhase;
}

interface Team {
  id: number;
  name: string;
  short_name: string;
  creation_date: string;
  is_active: boolean;
  city?: City;
}

interface TeamTournament {
  tournament_id: number;
  team_id: number;
  place?: number;
  tournament?: Tournament;
  team?: Team;
}

// TODO: Delete
// interface UserTeam {
//   user_id: number;
//   team_id: number;
//   is_captain: boolean;
//   start_date: string;
//   end_date?: string;
//   user?: User;
//   team?: Team;
// }

// TODO: Delete
// interface UserMatch {
//   is_match_creator: boolean;
//   is_referee: boolean;
//   is_mvp: boolean;
//   voted: boolean;
//   combined_rating: number;
//   user_id: string;
//   user_name: string;
//   user_last_name: string;
//   user_score: number;
//   user_email: string;
// }

// TODO: Delete
interface Match {
  id: number;
  start_date: string;
  for_team_only: boolean;
  description: string;
  num_of_players: number;
  open_for_referee: boolean;
  score?: number;
  opponent_score?: number;
  reservation_id?: number;
  tournament_id?: number;
  tournament_phase_id?: number;
  team_id?: number;
  opponent_team_id?: number;
  winner_team_id?: number;
  reservation?: Reservation;
  tournament?: Tournament;
  tournamentPhase?: TournamentPhase;
  team?: Team;
  opponent_team?: Team;
  winner_team?: Team;
  // users?: UserMatch[];
  weather?: Weather;
}

interface Weather {
  temp: number;
  description: string;
}

// TODO: Delete
interface MatchesData {
  match: Match;
  benefits: string[];
  signed_users: number;
}
