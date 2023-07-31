
import { useEffect, useState } from "react"
import axios from "axios"

const baseUrl = "http://127.0.0.1:5000"

const Inputs = () => {
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
        <div className="w-screen h-[calc(100vh-5rem)] bg-white dark:bg-gray-900 flex items-center justify-around">

            <div className="w-[35%] h-[20%] flex items-start justify-center flex-col px-4 py-5 sm:p-6 border border-gray-300 rounded-lg mb-12">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">Add an Task</h3>
                <div className="mt-2 max-w-xl text-md text-gray-500 dark:text-gray-100">
                    <p>What are you doing today? 😁</p>
                </div>
                <form className="mt-5 flex items-center w-full" onSubmit={handleSubmit}>
                    <div className="w-full">
                        <input 
                            className="w-full h-[2.2rem] border pl-2 focus-visible:outline-green-600 text-[1rem]"
                            onChange={(e) => handleChange(e, 'description')}
                            type="text"
                            name="description"
                            id="description"
                            placeholder="Add new task"
                            value={description}
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:ml-3 sm:mt-0 sm:w-auto"
                    >
                        Add
                    </button>
                </form>
            </div>


            <table className="w-1/2 divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-lg font-semibold text-gray-900 dark:text-white border-l-[1px]">
                    Your Tasks:
                  </th>
                  
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-lg font-semibold text-gray-900 dark:text-white border-l-[1px]">
                    <span className="">Actions:</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
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
                            className="pl-4 text-[1.4rem] focus-visible:outline-green-600"
                          />
                          <button className="bg-yellow-400 px-4 py-2 rounded-md ml-4 my-4" type="submit">Update</button>
                        </form>
                      </td>
                    </tr>
                  )
                } else {
                  return (
                    <tr>
                      {/* {format(new Date(event.created_at), "MM/dd, p")}: {" "} */}
                      <td className="pl-4 text-[1.2rem]  dark:text-white" key={event.id}>{event.description}</td>
                      <div class="flex items-center justify-evenly my-4">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md mr-4" onClick={() => handleUpdate(event)}>Edit</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => handleDelete(event.id)}>Delete</button>
                      </div>
                    </tr>
                  )
                }
              })}
              </tbody>
            </table>            
        </div>
    )
}

export default Inputs
