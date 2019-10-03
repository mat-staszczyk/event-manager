import React, { useState, createRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Pikaday from 'pikaday';
import { isEmptyObject, validateEvent, formatDate } from '../helpers/helpers';
import 'pikaday/css/pikaday.css';

function EventForm({ event: initialEvent, onSubmit }) {
  const [event, setEvent] = useState(initialEvent);
  const [errors, setErrors] = useState({});
  const dateInput = createRef();

  const updateEvent = (key, value) => {
    setEvent((prevEventState) => ({
      ...prevEventState,
      [key]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    updateEvent(name, value);
  };

  const handleSubmit = (e) => {
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
          {Object.values(errors).map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </div>
    );
  };

  const setEventDate = (date) => {
    const formattedDate = formatDate(date);
    updateEvent('event_date', formattedDate);
  };

  useEffect(() => {
    new Pikaday({
      field: dateInput.current,
      onSelect: (date) => setEventDate(date),
    });
  }, []);

  return (
    <div>
      <h2>New Event</h2>
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
            />
          </label>
        </div>
        <div>
          <label htmlFor="title">
            <strong>Title:</strong>
            <textarea
              cols="30"
              rows="10"
              id="title"
              name="title"
              onChange={handleInputChange}
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
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}

EventForm.propTypes = {
  event: PropTypes.shape(),
  onSubmit: PropTypes.func.isRequired,
};

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
