
import { useEffect, useState } from "react"
import axios from "axios"
import { format } from "date-fns"

import './App.css';

const baseUrl = "http://127.0.0.1:5000"

function App() {
  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [eventsList, setEventsList] = useState([]);
  const [eventId, setEventId] = useState(null);

  // Get ALL items
  const fetchEvents = async () => {
    const data = await axios.get(`${baseUrl}/events`)
    const { events } = data.data
    setEventsList(events);
    console.log("DATA", data)
  }

  const handleChange = (e, field) => {
    if(field === 'edit') {
      setEditDescription(e.target.value)
    } else {
      setDescription(e.target.value)
    }
  }

  // DELETE item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/event/${id}`)
      const updatedList = eventsList.filter(event => event.id !== id)
      setEventsList(updatedList)
    } catch (err) {
      console.err(err.message)
    }
  }

  // UPDATE item
  const handleUpdate = (event) => {
    setEventId(event.id)
    setEditDescription(event.description)
  }

  // CREATE/Submit item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(editDescription) {
        const data = await axios.put(`${baseUrl}/event/${eventId}`, {description: editDescription})
        const updatedEvent = data.data.event;
        const updatedList = eventsList.map(event => {
          if(event.id === eventId) {
            return event = updatedEvent
          }
          return event
        })
        setEventsList(updatedList)
      } else {
        const data = await axios.post(`${baseUrl}/event`, {description})
        setEventsList([...eventsList, data.data]);
      }
      setDescription('');
      setEditDescription('');
      setEventId(null);
    } catch (err) {
      console.error(err.message)
    }
  }

  useEffect(() => {
    fetchEvents();
  }, [])

  return (
    <div className="App">

      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="description">Description</label>
        <input 
          onChange={(e) => handleChange(e, 'description')}
          type="text"
          name="description"
          id="description"
          placeholder="Add new item"
          value={description}
        />
        <button className="btn" type="submit">Submit</button>
      </form>

      <table className="table">
        <tr>
          <th>Item</th>
        </tr>
        {eventsList.map(event =>{
          if (eventId === event.id) {
            return (
            <tr>
              <td>
                <form onSubmit={handleSubmit} key={event.id}>
                  <input 
                    onChange={(e) => handleChange(e, 'edit')}
                    type="text"
                    name="editDescription"
                    id="editDescription"
                    value={editDescription}
                  />
                  <button className="btn" type="submit">Update</button>
                </form>
              </td>
            </tr>
            )
          } else {
            return (
              <tr>
                {/* {format(new Date(event.created_at), "MM/dd, p")}: {" "} */}
                <td key={event.id}>{event.description}</td>
                <div>
                  <button className="update" onClick={() => handleUpdate(event)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(event.id)}>Delete</button>
                </div>
              </tr>
            )
          }
        })}
      </table>
    </div>
  );
}

export default App;

