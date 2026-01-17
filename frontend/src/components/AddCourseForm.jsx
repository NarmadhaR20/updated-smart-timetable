import { useState } from 'react';
import { addCourse } from '../services/api';

export default function AddCourseForm() {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        semester: 1,
        type: 'Theory',
        lectures_per_week: 3,
        faculty_id: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addCourse(formData);
            alert('Course Added!');
            // Reset logic here
        } catch (error) {
            alert('Error adding course: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Simplified for MVP Demo - Assume user enters ID manually for now or use dropdown in V2 */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Course Name</label>
                <input name="name" onChange={handleChange} className="mt-1 block w-full rounded-md border p-2" required />
            </div>
            {/* ... other fields ... */}
            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg">Add Course</button>
        </form>
    );
}
