import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { DataTable } from '../components/DataTable';
import { getLectures, addLecture } from '../services/api';

export default function Lectures() {
    const [lectures, setLectures] = useState([]);
    const [formData, setFormData] = useState({ unit_code: '', unit_name: '', duration: '', tutor: '', students: '', room_capacity_needed: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await getLectures();
            setLectures(res);
        } catch (err) { console.error(err); }
    };

    const handleAdd = async () => {
        try {
            await addLecture({
                ...formData,
                duration: parseInt(formData.duration),
                students: parseInt(formData.students),
                room_capacity_needed: parseInt(formData.room_capacity_needed || 0)
            });
            alert('Lecture Added Successfully');
            setFormData({ unit_code: '', unit_name: '', duration: '', tutor: '', students: '', room_capacity_needed: '' });
            loadData();
        } catch (error) {
            console.error(error);
            alert("Failed to add Lecture. " + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <Layout title="Lectures">
            <div className="flex gap-8">
                <div className="w-1/3 bg-white p-6 rounded-lg shadow-sm h-fit">
                    <form className="space-y-4">
                        <div>
                            <label className="block text-gray-600 mb-1">Unit Code:</label>
                            <input className="w-full border rounded p-2 focus:ring-2 focus:ring-orodha-blue outline-none" />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Unit Name:</label>
                            <input className="w-full border rounded p-2 focus:ring-2 focus:ring-orodha-blue outline-none" />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block text-gray-600 mb-1">Duration:</label>
                                <input className="w-full border rounded p-2 outline-none" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-gray-600 mb-1">Students:</label>
                                <input className="w-full border rounded p-2 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Tutor:</label>
                            <select className="w-full border rounded p-2 bg-white outline-none">
                                <option>DR. PETE</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Select Room Capacity</label>
                            <select className="w-full border rounded p-2 bg-white outline-none">
                                <option>Select</option>
                            </select>
                        </div>

                        <button className="w-full bg-orodha-blue hover:bg-blue-600 text-white py-2 rounded shadow font-semibold">ADD LECTURE</button>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-orodha-blue hover:bg-blue-600 text-white py-2 rounded shadow font-semibold">EDIT</button>
                            <button className="flex-1 bg-orodha-blue hover:bg-blue-600 text-white py-2 rounded shadow font-semibold">UPDATE</button>
                            <button className="flex-1 bg-orodha-blue hover:bg-blue-600 text-white py-2 rounded shadow font-semibold">DELETE</button>
                        </div>
                    </form>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <DataTable
                        headers={['ID', 'Unit Code', 'Unit Name', 'Duration', 'Tutor', 'Students', 'Room']}
                        data={lectures}
                        onEdit={() => { }}
                        onDelete={() => { }}
                    />
                </div>
            </div>
        </Layout>
    );
}
