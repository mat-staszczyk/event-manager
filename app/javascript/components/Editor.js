import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Header from './Header';
import EventList from './EventList';
import PropsRoute from './PropsRoute';
import Event from './Event';

function Editor({ match }) {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/events.json');
        setEvents(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  if (events === null) return null;

  const eventId = match.params.id;
  const event = events.find((e) => e.id === Number(eventId));

  return (
    <div>
      <Header />
      <EventList events={events} />
      <PropsRoute path="/events/:id" component={Event} event={event} />
    </div>
  );
}

Editor.propTypes = {
  match: PropTypes.shape(),
};

Editor.defaultProps = {
  match: undefined,
};

export default Editor;
