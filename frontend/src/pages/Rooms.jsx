import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { DataTable } from '../components/DataTable';
import { getRooms, addRoom, updateRoom, deleteRoom } from '../services/api';

export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [formData, setFormData] = useState({ room_no: '', name: '', capacity: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await getRooms();
            setRooms(res);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async () => {
        if (!formData.room_no || !formData.name || !formData.capacity) {
            alert("Please fill all fields");
            return;
        }

        try {
            const payload = { ...formData, capacity: parseInt(formData.capacity) };
            if (editingId) {
                await updateRoom(editingId, payload);
                alert('Room Updated Successfully');
            } else {
                await addRoom(payload);
                alert('Room Added Successfully');
            }
            setFormData({ room_no: '', name: '', capacity: '' });
            setEditingId(null);
            loadData();
        } catch (error) {
            console.error(error);
            alert("Operation Failed. " + (error.response?.data?.detail || error.message));
        }
    };

    const handleEdit = (room) => {
        setFormData({
            room_no: room.room_no,
            name: room.name,
            capacity: room.capacity
        });
        setEditingId(room.id);
    };

    const handleDelete = async (row) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;
        try {
            await deleteRoom(row.id);
            alert("Room Deleted");
            loadData();
        } catch (error) {
            alert("Failed to delete: " + error.message);
        }
    };

    return (
        <Layout title="Lecture Rooms">
            <div className="flex gap-8">
                <div className="w-1/3 bg-white p-6 rounded-lg shadow-sm h-fit">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">{editingId ? 'Edit Room' : 'Add New Room'}</h3>
                    <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                        <div>
                            <label className="block text-gray-600 mb-1">Room no.:</label>
                            <input className="w-full border rounded p-2 focus:ring-2 focus:ring-orodha-blue outline-none"
                                value={formData.room_no} onChange={e => setFormData({ ...formData, room_no: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Room Name:</label>
                            <input className="w-full border rounded p-2 focus:ring-2 focus:ring-orodha-blue outline-none"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Capacity:</label>
                            <input type="number" className="w-full border rounded p-2 focus:ring-2 focus:ring-orodha-blue outline-none"
                                value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-2">
                            <button onClick={handleSubmit} className="flex-1 bg-orodha-purple hover:bg-purple-800 text-white py-2 rounded shadow font-semibold">
                                {editingId ? 'UPDATE' : 'ADD ROOM'}
                            </button>
                            {editingId && (
                                <button onClick={() => { setEditingId(null); setFormData({ room_no: '', name: '', capacity: '' }); }} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow font-semibold">
                                    CANCEL
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="flex-1">
                    <DataTable
                        headers={['ID', 'Room no', 'Name', 'Capacity']}
                        data={rooms}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </Layout>
    );
}
