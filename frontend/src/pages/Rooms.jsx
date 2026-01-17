import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { DataTable } from '../components/DataTable';
import { getRooms, addRoom, updateRoom, deleteRoom } from '../services/api';

export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [formData, setFormData] = useState({ room_no: '', name: '', capacity: '', type: 'Classroom' });
    const [editingId, setEditingId] = useState(null);

    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

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
            setFormData({ room_no: '', name: '', capacity: '', type: 'Classroom' });
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
            capacity: room.capacity,
            type: room.type || 'Classroom'
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
        <Layout title="Manage Rooms">
            <div className={isAdmin ? "flex gap-8" : ""}>
                {/* Only show form for Admin users */}
                {isAdmin && (
                    <div className="w-1/3 bg-white p-6 rounded shadow h-fit max-h-[85vh] overflow-y-auto">
                        <h3 className="font-bold text-lg mb-4 text-orodha-purple">{editingId ? 'Edit Room' : 'Add New Room'}</h3>
                        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1 tracking-tight">Room No.</label>
                                <input className="w-full border p-2 rounded focus:ring-2 focus:ring-orodha-purple outline-none"
                                    value={formData.room_no} onChange={e => setFormData({ ...formData, room_no: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1 tracking-tight">Room Name</label>
                                <input className="w-full border p-2 rounded focus:ring-2 focus:ring-orodha-purple outline-none"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1 tracking-tight">Type</label>
                                    <select className="w-full border p-2 rounded focus:ring-2 focus:ring-orodha-purple outline-none"
                                        value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option>Classroom</option>
                                        <option>Lab</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1 tracking-tight">Capacity</label>
                                    <input type="number" className="w-full border p-2 rounded focus:ring-2 focus:ring-orodha-purple outline-none"
                                        value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button onClick={handleSubmit} className="flex-1 bg-orodha-purple text-white py-3 rounded-lg font-bold shadow-lg transition active:scale-95">
                                    {editingId ? 'UPDATE ROOM' : 'ADD ROOM'}
                                </button>
                                {editingId && (
                                    <button onClick={() => { setEditingId(null); setFormData({ room_no: '', name: '', capacity: '', type: 'Classroom' }); }}
                                        className="bg-gray-100 text-gray-600 px-4 rounded-lg font-bold">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                <div className={isAdmin ? "flex-1 space-y-8" : "space-y-8"}>
                    {/* Classrooms Table */}
                    <div>
                        <h4 className="font-bold text-gray-700 mb-3 uppercase tracking-widest text-[10px] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Classrooms
                        </h4>
                        <DataTable
                            headers={['Room No', 'Name', 'Capacity']}
                            data={rooms
                                .filter(r => r.type === 'Classroom' || !r.type)
                                .map(r => ({
                                    ...r,
                                    room_no: r.room_no
                                }))}
                            onEdit={isAdmin ? handleEdit : null}
                            onDelete={isAdmin ? handleDelete : null}
                            showActions={isAdmin}
                        />
                    </div>

                    {/* Labs Table */}
                    <div>
                        <h4 className="font-bold text-gray-700 mb-3 uppercase tracking-widest text-[10px] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            Labs
                        </h4>
                        <DataTable
                            headers={['Room No', 'Name', 'Capacity']}
                            data={rooms
                                .filter(r => r.type === 'Lab')
                                .map(r => ({
                                    ...r,
                                    room_no: r.room_no
                                }))}
                            onEdit={isAdmin ? handleEdit : null}
                            onDelete={isAdmin ? handleDelete : null}
                            showActions={isAdmin}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
