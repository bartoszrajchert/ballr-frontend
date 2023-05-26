enum ROUTES {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  FORGOT_PASSWORD = '/forgot-password',

  MATCHES = '/matches',
  MATCHES_CREATE = '/matches/create',

  FACILITIES = '/facilities',
  FACILITIES_CREATE = '/facilities/create',

  TOURNAMENTS = '/tournaments',
  TOURNAMENTS_CREATE = '/tournaments/create',

  TEAMS = '/teams',
  TEAMS_CREATE = '/teams/create',

  PROFILE = '/profile',

  SETTINGS = '/settings',
  SETTINGS_SECURITY = '/settings/security',

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
}

enum QUERY_PARAMS {
  REDIRECT = 'redirect',
}

export { ROUTES, BACKEND_ROUTES, QUERY_PARAMS };
