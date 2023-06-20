export function firebaseError(error: Error) {
  if (error?.message.includes('auth/requires-recent-login')) {
    return 'Aby wykonać tę akcję, musisz się zalogować ponownie.';
  }
}
