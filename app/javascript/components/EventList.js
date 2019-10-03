import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function EventList({ activeId, events }) {
  const [searchTerm, setSearchTerm] = useState('');
  const searchInput = useRef();

  const updateSearchTerm = () => {
    setSearchTerm(searchInput.current.value);
  };

  const matchSearchTerm = (obj) => {
    const {
      id,
      published,
      created_at,
      updated_at,
      ...rest
    } = obj;

    return Object.values(rest).some(
      (value) => value.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1,
    );
  };

  const renderEvents = () => {
    const filteredEvents = events
      .filter((el) => matchSearchTerm(el))
      .sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

    return filteredEvents.map((event) => (
      <li key={event.id}>
        <Link to={`/events/${event.id}`} className={activeId === event.id ? 'active' : ''}>
          {event.event_date}
          {' - '}
          {event.event_type}
        </Link>
      </li>
    ));
  };

  return (
    <section className="eventList">
      <h2>
        Events
        <Link to="/events/new">New Event</Link>
      </h2>

      <input
        className="search"
        placeholder="Search"
        type="text"
        ref={searchInput}
        onKeyUp={updateSearchTerm}
      />

      <ul>{renderEvents()}</ul>
    </section>
  );
}

EventList.propTypes = {
  activeId: PropTypes.number,
  events: PropTypes.arrayOf(PropTypes.object),
};

EventList.defaultProps = {
  activeId: undefined,
  events: [],
};

export default EventList;
