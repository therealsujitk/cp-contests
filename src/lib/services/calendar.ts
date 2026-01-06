import type { Contest } from "$lib/interfaces";

export function addToGoogleCalendar(contest: Contest) {
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', `[${new URL(contest.url).hostname}] ${contest.title}`);
  url.searchParams.append('details', `Event created by ${window.location.hostname}`);
  url.searchParams.append('location', contest.url);
  url.searchParams.append('dates', `${toCleanISOString(contest.startTime)}/${toCleanISOString(contest.endTime)}`);

  window.open(url, '_blank');
}

export function downloadICSFile(contest: Contest) {
  const icsContent = 'BEGIN:VCALENDAR\n' + 
      'VERSION:2.0\n' +
      'CALSCALE:GREGORIAN\n' +
      'BEGIN:VEVENT\n' +
      `SUMMARY:[${new URL(contest.url).hostname}] ${contest.title}\n` +
      `DESCRIPTION:Event created by ${window.location.hostname}\n` +
      `LOCATION:${contest.url}\n` +
      `DTSTART:${toCleanISOString(contest.startTime)}\n` +
      `DTEND:${toCleanISOString(contest.endTime)}\n` +
      'END:VEVENT\n' +
      'END:VCALENDAR';

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "event.ics";
  link.click();

  URL.revokeObjectURL(url);
}

function toCleanISOString(date: Date) {
  let isoString = date.toISOString();
  isoString = isoString.split('.')[0] + 'Z';
  isoString = isoString.replace(/-/g, '').replace(/:/g, '');
  return isoString;
}
