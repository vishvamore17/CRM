"use client"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";


interface IFormInput {
    _id: any;
    subject: string;
    assignedUser: string;
    customer: string;
    location: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'postponed'; 
    eventType: 'call' | 'meeting' | 'demo' | 'follow-up';
    priority: 'low' | 'medium' | 'high';
    description: string;
    
    recurrence: 'one-time' | 'daily' | 'weekly' | 'monthly' | 'yearly'; 
    date: string;
}

// interface Event {
//     _id: string;
//     subject: string;
//     assignedUser: string;
//     customer: string;
//     location: string;
//     status: 'scheduled' | 'completed' | 'cancelled' | 'postponed'; 
//     eventType: 'call' | 'meeting' | 'demo' | 'follow-up';
//     priority: 'low' | 'medium' | 'high';
//     recurrence: 'one-time' | 'daily' | 'weekly' | 'monthly' | 'yearly';
//     description: string;
//     date: string;
//   }
  
const EventTable = () => {
    const [events, setEvents] = useState<IFormInput[]>([]);
    const [form, setForm] = useState({
        subject: '',
        assignedUser: '',
        customer: '',
        location: '',
        status: 'scheduled',
        eventType: 'call',
        priority: 'medium',
        description: '',
        // reminder: undefined,
        recurrence: 'one-time',
        date: '',
    });

    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const fetchEvents = async () => {
        const { data } = await axios.get("http://localhost:8000/api/v1/scheduledevents/getAllScheduledEvents");
        setEvents(data.data);
    }

    const handleSubmit = async (e :React.FormEvent) => {
         e.preventDefault();
         if(editId){
            await axios.put(`http://localhost:8000/api/v1/scheduledevents/updateScheduledEvent/${editId}`,form);
            setEditId(null);
            toast.success("Event updated successfully");
            setShowForm(false);
         }
         else{
            await axios.post("http://localhost:8000/api/v1/scheduledevents/createScheduledEvent",form);
                toast.success("Event created successfully");
         }
        fetchEvents();
        setForm({
            subject: '',
            assignedUser: '',
            customer: '',
            location: '',
            status: 'scheduled',
            eventType: 'call',
            priority: 'medium',
            description: '',
            // reminder: undefined,
            recurrence: 'one-time',
            date: '',
        });
        setEditId(null);
        setShowForm(false);
    }

    const handleEdit = (event : IFormInput) => {
        setForm({
            subject: event.subject,
            assignedUser: event.assignedUser ,
            customer: event.customer,
            location: event.location,
            status: event.status,
            eventType: event.eventType,
            priority: event.priority,
            description: event.description,
            // reminder: event.reminder,
            recurrence: event.recurrence,
            date: event.date, 
        });
        setEditId(event._id || null);
        setShowForm(true);
    }
    
    const handleDelete = async (editId: any) => {
        try {
            await axios.delete(`http://localhost:8000/api/v1/scheduledevents/deleteScheduledEvent/${editId}`);
            toast.success("Event deleted successfully!");
            fetchEvents();
        } catch (error) {
            toast.error("Error deleting the event.");
        }
    };
    
    const handEventdClick = () => {
        setForm({
            subject: '',
            assignedUser: '',
            customer: '',
            location: '',
            status: 'scheduled',
            eventType: 'call',
            priority: 'medium',
            description: '',
            // reminder: undefined,
            recurrence: "one-time",
            date: '',
        });
        setEditId(null);
        setShowForm(true);
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="container">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="content">
                <button onClick={handEventdClick} style={{ backgroundColor: '#393BB2', color: 'white', padding: '10px 20px', borderRadius: '5px' }}>
                    Add Event
                </button>
                
                {showForm ? (
                    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
                        <div className="form-content">
                            <button className="close-button" onClick={() => setShowForm(false)} style={{ fontSize: '20px', position: 'absolute', right: '10px', top: '10px' }}>X</button>
                            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{editId ? "Update Event" : "Add Event"}</h1>
                            
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Subject</label>
                                <input 
                                    type="text" 
                                    value={form.subject} 
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })} 
                                    required 
                                    style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Host</label>
                                <input 
                                    type="text" 
                                    value={form.assignedUser} 
                                    onChange={(e) => setForm({ ...form, assignedUser: e.target.value })} 
                                    required 
                                    style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Customer/Event</label>
                                <input 
                                    type="text" 
                                    value={form.customer} 
                                    onChange={(e) => setForm({ ...form, customer: e.target.value })} 
                                    required 
                                    style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Location</label>
                                <input 
                                    type="text" 
                                    value={form.location} 
                                    onChange={(e) => setForm({ ...form, location: e.target.value })} 
                                    required 
                                    style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                                />
                            </div>

                            <div className="form-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div className="form-group" style={{ width: '48%' }}>
                                    <label>Status</label>
                                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} 
                                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
                                        <option>Scheduled</option>
                                        <option>Completed</option>
                                        <option>Cancelled</option> 
                                        <option>Postpone</option>
                                    </select>
                                </div>

                                <div className="form-group" style={{ width: '48%' }}>
                                    <label>Event Type</label>
                                    <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} 
                                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
                                        <option>Call</option>
                                        <option>Meeting</option>
                                        <option>Demo</option>
                                        <option>Follow-Up</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div className="form-group" style={{ width: '48%' }}>
                                    <label>Priority</label>
                                    <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} 
                                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </div>

                                <div className="form-group" style={{ width: '48%' }}>
                                    <label>Recurrence</label>
                                    <select value={form.recurrence} onChange={(e) => setForm({ ...form, recurrence: e.target.value })} 
                                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
                                        <option>one-time</option>
                                        <option>Daily</option>
                                        <option>Weekly</option>
                                        <option>Monthly</option>
                                        <option>Yearly</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                                <textarea 
                                    value={form.description} 
                                    onChange={(e) => setForm({ ...form, description: e.target.value })} 
                                    required 
                                    style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', height: '100px' }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Date</label>
                                <input 
                                    type="date" 
                                    value={form.date} 
                                    onChange={(e) => setForm({ ...form, date: e.target.value })} 
                                    required 
                                    style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                                />
                            </div>

                            <button 
                                type="submit" 
                                style={{ backgroundColor: '#393BB2', color: 'white', padding: '10px 20px', borderRadius: '5px', width: '100%' }}>
                                {editId ? "Update" : "Add"} Event
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="table-container">
                        <div className="table-header" style={{ backgroundColor: '#E2CBFF', padding: '10px', fontWeight: 'bold' }}>Event List</div>
                        <div className="table-responsive">
                            <table className="table-content" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Host</th>
                                        <th>Customer</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Event Type</th>
                                        <th>Priority</th>
                                        <th>Reccurence</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event,index) => (
                                        <tr key={`${event._id}-${index}`} style={{ textAlign: 'center', padding: '10px' }}>
                                            <td>{event.subject}</td>
                                            <td>{event.assignedUser}</td>
                                            <td>{event.customer}</td>
                                            <td>{event.location}</td>
                                            <td>{event.status}</td>
                                            <td>{event.eventType}</td>
                                            <td>{event.priority}</td>
                                            <td>{event.recurrence}</td>
                                            <td>{event.description}</td>
                                            <td>{new Date(event.date).toISOString().split("T")[0]}</td>
                                            <td>
                                                <button onClick={() => handleEdit(event)} style={{ marginRight: '10px' }}>📝</button>
                                                <button onClick={() => handleDelete(event._id)} >🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventTable;
