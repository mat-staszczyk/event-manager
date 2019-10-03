import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './Header';
import EventList from './EventList';
import PropsRoute from './PropsRoute';
import Event from './Event';
import EventForm from './EventForm';
import { success } from '../helpers/notifications';
import { handleAjaxError } from '../helpers/helpers';

function Editor({ match, history }) {
  const [events, setEvents] = useState(null);

  const addEvent = async (newEvent) => {
    try {
      const response = await axios.post('/api/events.json', newEvent);
      const savedEvent = response.data;

      success('Event Added!');
      setEvents((prevEvents) => ([...prevEvents, savedEvent]));
      history.push(`/events/${savedEvent.id}`);
    } catch (error) {
      handleAjaxError(error);
    }
  };

  const updateEvent = async (updatedEvent) => {
    try {
      axios.put(`/api/events/${updatedEvent.id}.json`, updatedEvent);
      success('Event updated');
      const eventIndex = events.findIndex((eventItem) => eventItem.id === updatedEvent.id);
      events[eventIndex] = updatedEvent;
      history.push(`/events/${updatedEvent.id}`);
      setEvents(events);
    } catch (error) {
      handleAjaxError(error);
    }
  };


  const deleteEvent = async (eventId) => {
    const confirmation = window.confirm('Are you sure?');
    if (confirmation) {
      try {
        const response = await axios.delete(`/api/events/${eventId}.json`);
        if (response.status === 204) {
          success('Event deleted');
          history.push('/events');
          setEvents(events.filter((event) => event.id !== eventId));
        }
      } catch (error) {
        handleAjaxError(error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/events.json');
        setEvents(response.data);
      } catch (error) {
        handleAjaxError(error);
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
          <PropsRoute
            path="/events/new"
            component={EventForm}
            onSubmit={addEvent}
          />
          <PropsRoute
            exact
            path="/events/:id/edit"
            component={EventForm}
            event={event}
            onSubmit={updateEvent}
          />
          <PropsRoute
            path="/events/:id"
            component={Event}
            event={event}
            onDelete={deleteEvent}
          />
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
