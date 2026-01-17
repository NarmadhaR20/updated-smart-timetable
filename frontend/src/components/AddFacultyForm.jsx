import { useState } from 'react';
import { addFaculty } from '../services/api';

export default function AddFacultyForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        designation: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addFaculty(formData);
            alert('Faculty Added!');
            setFormData({ name: '', email: '', designation: '' });
        } catch (error) {
            alert('Error adding faculty: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Designation</label>
                <input
                    name="designation"
                    type="text"
                    value={formData.designation}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    placeholder="e.g. Professor"
                    required
                />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                Add Faculty
            </button>
        </form>
    );
}
