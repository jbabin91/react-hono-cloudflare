import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDate(date: string) {
  return dayjs(date).format('MMMM D, YYYY h:mm A');
}
