export function getAddressFromFacility(facility?: Facility) {
  return `${facility?.street}, ${facility?.postcode} ${facility?.city?.Name}`;
}

export function getLocaleDateString(date?: string) {
  const inputDate = date ? new Date(date) : new Date();

  const year = inputDate.getFullYear();
  const month = ('0' + (inputDate.getMonth() + 1)).slice(-2);
  const day = ('0' + inputDate.getDate()).slice(-2);
  const hour = ('0' + inputDate.getHours()).slice(-2);
  const minute = ('0' + inputDate.getMinutes()).slice(-2);

  return `${day}/${month}/${year} • ${hour}:${minute}`;
}
