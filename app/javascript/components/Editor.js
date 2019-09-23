import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import EventList from './EventList';

function Editor() {
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

  return (
    <div>
      <Header />
      <EventList events={events} />
    </div>
  );
}

export default Editor;
