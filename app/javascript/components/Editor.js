import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './Header';
import EventList from './EventList';
import PropsRoute from './PropsRoute';
import Event from './Event';
import EventForm from './EventForm';

function Editor({ match, history }) {
  const [events, setEvents] = useState(null);

  const addEvent = (newEvent) => {
    axios
      .post('/api/events.json', newEvent)
      .then((response) => {
        const savedEvent = response.data;

        setEvents((prevEvents) => ([...prevEvents, savedEvent]));
        history.push(`/events/${savedEvent.id}`);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const deleteEvent = (eventId) => {
    const confirmation = window.confirm('Are you sure?');
    if (confirmation) {
      axios
        .delete(`/api/events/${eventId}.json`)
        .then((response) => {
          if (response.status === 204) {
            history.push('/events');
            setEvents(events.filter((event) => event.id !== eventId));
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

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
      <div className="grid">
        <EventList events={events} activeId={Number(eventId)} />
        <Switch>
          <PropsRoute path="/events/new" component={EventForm} onSubmit={addEvent} />
          <PropsRoute path="/events/:id" component={Event} event={event} onDelete={deleteEvent} />
        </Switch>
      </div>
    </div>
  );
}

Editor.propTypes = {
  match: PropTypes.shape(),
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

Editor.defaultProps = {
  match: undefined,
};

export default Editor;
