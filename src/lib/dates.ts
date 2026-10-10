const readable = new Intl.DateTimeFormat('de-AT', {
  timeZone: 'Europe/Vienna',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

// 29. Mai 2017
export const readableDate = (date: Date) => readable.format(date)

// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
export const htmlDateString = (date: Date) =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Vienna' }).format(date)
