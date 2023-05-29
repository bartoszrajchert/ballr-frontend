enum ROUTES {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  FORGOT_PASSWORD = '/forgot-password',

  MATCHES = '/matches',
  MATCHES_CREATE = '/matches/create',

  FACILITIES = '/facilities',
  FACILITIES_CREATE = '/facilities/create',
  FIELDS = '/fields',

  TOURNAMENTS = '/tournaments',
  TOURNAMENTS_CREATE = '/tournaments/create',

  TEAMS = '/teams',
  TEAMS_CREATE = '/teams/create',

  PROFILE = '/profile',

  SETTINGS = '/profile/settings',
  SETTINGS_SECURITY = '/profile/settings/security',

  PROTECTED_PAGE = '/protected-page',
  REQUESTS_TEST_PAGE = '/requests-test-page',
}

enum BACKEND_ROUTES {
  MATCHES = '/matches',
  GENDERS = '/genders',
  USERS = '/users',
  CITIES = '/cities',
  FACILITIES = '/facilities',
  BENEFITS = '/benefits',
  RESERVATIONS = '/reservations',
}

enum QUERY_PARAMS {
  REDIRECT = 'redirect',
  CANCEL_REDIRECT = 'cancelRedirect', // Used to cancel redirect when user doesn't have access to the page
}

export { ROUTES, BACKEND_ROUTES, QUERY_PARAMS };
