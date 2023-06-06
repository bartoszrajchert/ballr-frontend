enum ROUTES {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  FORGOT_PASSWORD = '/forgot-password',
  CREATE_PROFILE = '/create-profile',

  MATCHES = '/matches',
  MATCHES_NEW = '/matches/new',

  FACILITIES = '/facilities',
  FIELDS = '/fields',

  TEAMS = '/teams',
  TEAMS_NEW = '/teams/new',

  PROFILE = '/profile',

  SETTINGS = '/profile/settings',
  SETTINGS_SECURITY = '/profile/settings/security',
  SETTINGS_EDIT = '/profile/settings/edit',
  SETTINGS_RESERVATIONS = '/profile/settings/reservations',
  SETTINGS_MATCHES = '/profile/settings/matches',

  RESERVATIONS = '/reservations',
}

enum BACKEND_ROUTES {
  MATCHES = '/matches',
  GENDERS = '/genders',
  USERS = '/users',
  CITIES = '/cities',
  FACILITIES = '/facilities',
  BENEFITS = '/benefits',
  RESERVATIONS = '/reservations',
  TEAMS = '/teams',
}

enum QUERY_PARAMS {
  REDIRECT = 'redirect',
  CANCEL_REDIRECT = 'cancelRedirect', // Used to cancel redirect when user doesn't have access to the page
}

export { ROUTES, BACKEND_ROUTES, QUERY_PARAMS };
