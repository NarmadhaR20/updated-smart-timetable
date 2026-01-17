import { useState } from 'react';
import TimetableGrid from '../components/TimetableGrid';

export default function TimetableView() {
    const [year, setYear] = useState('1');
    const [section, setSection] = useState('A');

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-center">Academic Timetable</h1>

            <div className="flex justify-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm w-fit mx-auto border border-gray-100">
                <select value={year} onChange={e => setYear(e.target.value)} className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                </select>
                <select value={section} onChange={e => setSection(e.target.value)} className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Select Section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                </select>
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                    View Timetable
                </button>
            </div>

            <TimetableGrid year={year} section={section} />
        </div>
    );
}
