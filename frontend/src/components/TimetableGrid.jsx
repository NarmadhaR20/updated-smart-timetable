import { useState, useEffect } from 'react';
import { getTimetable } from '../services/api';

export default function TimetableGrid({ year, section }) {
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mock header
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const slots = ["9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00"];

    useEffect(() => {
        if (!year || !section) return;

        // Polling or Fetching logic
        // For MVP, we just fetch once or when props change.
        // In a real app, we might check if 'status' is generated.
    }, [year, section]);

    // Placeholder data since we don't have real connection running to fetch
    // Use this to demonstrate the UI
    const mockData = {
        "Monday": ["Maths (Dr. A)", "Physics (Dr. B)", "Chemistry (Dr. C)", "Lunch", "Lab A", "Lab A", "Sports"],
        "Tuesday": ["English", "Maths", "CS", "Lunch", "Library", "Physics", "Free"],
        "Wednesday": ["CS", "CS", "Maths", "Lunch", "Physics", "Chemistry", "Mentor"],
        "Thursday": ["Lab B", "Lab B", "English", "Lunch", "Maths", "CS", "Free"],
        "Friday": ["Physics", "Chemistry", "English", "Lunch", "CS", "Maths", "Club"]
    };

    return (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
            <table className="w-full min-w-[800px]">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="p-4 text-left font-semibold text-gray-600 w-32">Day / Time</th>
                        {slots.map(slot => (
                            <th key={slot} className="p-4 text-center font-semibold text-gray-600 border-l border-gray-100">
                                {slot}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {days.map((day) => (
                        <tr key={day} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="p-4 font-bold text-gray-700 bg-gray-50/50">{day}</td>
                            {slots.map((slot, index) => {
                                const subject = mockData[day] ? mockData[day][index] : "Free";
                                return (
                                    <td key={index} className="p-4 text-center border-l border-gray-100">
                                        <div className={`p-2 rounded-lg text-sm font-medium ${subject === "Lunch" ? "bg-yellow-100 text-yellow-700" :
                                                subject === "Free" ? "bg-gray-100 text-gray-400" :
                                                    "bg-blue-50 text-blue-700"
                                            }`}>
                                            {subject}
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
