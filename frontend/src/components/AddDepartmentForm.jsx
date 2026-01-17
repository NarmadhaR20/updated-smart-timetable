import { useState } from 'react';
import { addDepartment } from '../services/api';

export default function AddDepartmentForm() {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDepartment({ name, code });
            alert('Department Added!');
            setName('');
            setCode('');
        } catch (error) {
            alert('Error adding department: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Department Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    placeholder="e.g. Information Technology"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Code</label>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    placeholder="e.g. IT"
                    required
                />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Add Department
            </button>
        </form>
    );
}
