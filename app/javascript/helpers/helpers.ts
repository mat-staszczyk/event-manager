import { error } from './notifications';
import EventType from '../types/event';

export const isEmptyObject = (obj: object) => Object.keys(obj).length === 0;

const isValidDate = (dateObj: string) => !Number.isNaN(Date.parse(dateObj));

interface ErrorsObject {
  event_type?: string,
  event_date?: string,
  title?: string,
  speaker?: string,
  host?: string,
}

export const validateEvent = (event: EventType) => {
  const errors: ErrorsObject = {};

  if (event.event_type === '') {
    errors['event_type'] = 'You must enter an event type';
  }

  if (!isValidDate(event.event_date.toString())) {
    errors.event_date = 'You must enter a valid date';
  }

  if (event.title === '') {
    errors.title = 'You must enter a title';
  }

  if (event.speaker === '') {
    errors.speaker = 'You must enter at least one speaker';
  }

  if (event.host === '') {
    errors.host = 'You must enter at least one host';
  }

  return errors;
};

export const formatDate = (d: Date) => {
  const YYYY = d.getFullYear();
  const MM = `0${d.getMonth() + 1}`.slice(-2);
  const DD = `0${d.getDate()}`.slice(-2);

  return `${YYYY}-${MM}-${DD}`;
};

export const handleAjaxError = (err: object) => {
  error('Something went wrong');
  console.warn(err);
};
