import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History } from 'history'
import { Switch } from 'react-router-dom';
import Header from './Header';
import EventList from './EventList';
import PropsRoute from './PropsRoute';
import Event from './Event';
import EventForm from './EventForm';
import { success } from '../helpers/notifications';
import { handleAjaxError } from '../helpers/helpers';
import EventType from '../types/event';

interface EditorProps {
  match: {
    params: {
      id: number,
    }
  }
  history: History,
}

function Editor({ match, history }: EditorProps) {
  const [events, setEvents] = useState<Array<EventType>>([]);

  const addEvent = async (newEvent: EventType) => {
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

  const updateEvent = async (updatedEvent: EventType) => {
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


  const deleteEvent = async (eventId: number) => {
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
  const event = events.find((e: EventType) => e.id === Number(eventId));

  return (
    <div>
      <Header />
      <div className="grid">
        <EventList events={events} activeId={Number(eventId)} />
        <Switch>
          <PropsRoute
            component={EventForm}
            path="/events/new"
            onSubmit={addEvent}
          />
          <PropsRoute
            component={EventForm}
            exact
            path="/events/:id/edit"
            event={event}
            onSubmit={updateEvent}
          />
          <PropsRoute
            component={Event}
            path="/events/:id"
            event={event}
            onDelete={deleteEvent}
          />
        </Switch>
      </div>
    </div>
  );
}

Editor.defaultProps = {
  match: undefined,
};

export default Editor;
