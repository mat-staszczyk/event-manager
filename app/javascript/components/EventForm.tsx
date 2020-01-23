import React, { useState, useRef, useEffect } from 'react';
import Pikaday from 'pikaday';
import { Link } from 'react-router-dom';
import EventNotFound from './EventNotFound';
import { isEmptyObject, validateEvent, formatDate } from '../helpers/helpers';
import EventType from '../types/event';
import 'pikaday/css/pikaday.css';

type EventFormProps = {
  event: EventType,
  onSubmit(event: EventType): void,
  path: string,
}

function EventForm({ event: initialEvent, onSubmit, path }: EventFormProps): JSX.Element {
  const [event, setEvent] = useState(initialEvent);
  const [errors, setErrors] = useState({});
  const dateInput = useRef(null);
  const cancelURL = event.id ? `/events/${event.id}` : '/events';
  const title = event.id ? `${event.event_date} - ${event.event_type}` : 'New Event';

  const updateEvent = (key: string, value: string | boolean) => {
    setEvent((prevEventState) => ({
      ...prevEventState,
      [key]: value,
    }));
  };

  const handleInputChange = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    updateEvent(target.name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateEvent(event);
    if (!isEmptyObject(validationErrors)) {
      setErrors(validationErrors);
    } else {
      onSubmit(event);
    }
  };

  const renderErrors = () => {
    if (isEmptyObject(errors)) {
      return null;
    }

    return (
      <div className="errors">
        <h3>The following errors prohibited the event from being saved:</h3>
        <ul>
          {Object.values(errors).map((error: string) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </div>
    );
  };

  const setEventDate = (date: Date) => {
    const formattedDate = formatDate(date);
    updateEvent('event_date', formattedDate);
  };

  useEffect(() => {
    new Pikaday({
      field: dateInput.current,
      toString: (date: Date) => formatDate(date),
      onSelect: (date: Date) => setEventDate(date),
    });
  }, []);

  useEffect(() => {
    setEvent(initialEvent);
  }, [initialEvent]);

  if (!event.id && path === '/events/:id/edit') return <EventNotFound />;

  return (
    <div>
      <h2>{title}</h2>
      {renderErrors()}
      <form className="eventForm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="event_type">
            <strong>Type:</strong>
            <input
              type="text"
              id="event_type"
              name="event_type"
              onChange={handleInputChange}
              value={event.event_type}
            />
          </label>
        </div>
        <div>
          <label htmlFor="event_date">
            <strong>Date:</strong>
            <input
              type="text"
              id="event_date"
              name="event_date"
              ref={dateInput}
              autoComplete="off"
              onChange={handleInputChange}
              value={event.event_date.toString()}
            />
          </label>
        </div>
        <div>
          <label htmlFor="title">
            <strong>Title:</strong>
            <textarea
              cols={30}
              rows={10}
              id="title"
              name="title"
              onChange={handleInputChange}
              value={event.title}
            />
          </label>
        </div>
        <div>
          <label htmlFor="speaker">
            <strong>Speakers:</strong>
            <input
              type="text"
              id="speaker"
              name="speaker"
              onChange={handleInputChange}
              value={event.speaker}
            />
          </label>
        </div>
        <div>
          <label htmlFor="host">
            <strong>Hosts:</strong>
            <input
              type="text"
              id="host"
              name="host"
              onChange={handleInputChange}
              value={event.host}
            />
          </label>
        </div>
        <div>
          <label htmlFor="published">
            <strong>Publish:</strong>
            <input
              type="checkbox"
              id="published"
              name="published"
              onChange={handleInputChange}
              checked={!!event.published}
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit">Save</button>
          <Link to={cancelURL}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}

EventForm.defaultProps = {
  event: {
    event_type: '',
    event_date: '',
    title: '',
    speaker: '',
    host: '',
    published: false,
  },
};

export default EventForm;
