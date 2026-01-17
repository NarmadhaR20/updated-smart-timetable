import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function Timetables() {
    // This page is for Students to View the generated timetable
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState({ department_code: '', semester: '' });
    const [timetable, setTimetable] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        api.getDepartments().then(res => setDepartments(res || []));
    }, []);

    const handleSearch = async () => {
        if (!search.department_code || !search.semester) {
            alert("Select Dept and Semester");
            return;
        }
        setLoading(true);
        setSearched(true);
        try {
            const res = await api.getTimetable({
                department_code: search.department_code,
                semester: parseInt(search.semester)
            });
            setTimetable(res.schedule);
        } catch (err) {
            console.error(err);
            setTimetable([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Student Timetable Viewer">
            <div className="bg-white p-6 rounded shadow mb-6">
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-bold mb-1">Department</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={search.department_code}
                            onChange={e => setSearch({ ...search, department_code: e.target.value })}
                        >
                            <option value="">Select Department</option>
                            {departments.map(d => <option key={d.id} value={d.code}>{d.name}</option>)}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-bold mb-1">Semester</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={search.semester}
                            onChange={e => setSearch({ ...search, semester: e.target.value })}
                        >
                            <option value="">Select Semester</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-orodha-blue text-white font-bold rounded shadow hover:bg-blue-700 h-10"
                    >
                        FIND TIMETABLE
                    </button>
                </div>
            </div>

            {loading && <div className="text-center py-10">Loading...</div>}

            {!loading && searched && (!timetable || timetable.length === 0) && (
                <div className="text-center py-10 text-gray-500 bg-white rounded shadow">
                    No timetable published for this class yet.
                </div>
            )}

            {!loading && timetable && timetable.length > 0 && (
                <div className="bg-white p-6 rounded shadow overflow-x-auto">
                    <h2 className="text-xl font-bold mb-4 text-center text-orodha-purple">
                        {search.department_code} - Semester {search.semester}
                    </h2>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Day / Time</th>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(p => <th key={p} className="border p-2">Period {p}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                                <tr key={day}>
                                    <td className="font-bold border p-2 bg-gray-50">{day}</td>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(period => {
                                        const slot = timetable.find(s => s.day === day && s.period === period);
                                        return (
                                            <td key={period} className="border p-2 text-center text-sm">
                                                {slot ? (
                                                    <div className={`p-1 rounded ${slot.type === 'Lab' ? 'bg-orange-100 border-orange-200' : 'bg-blue-50 border-blue-100'} border`}>
                                                        <div className="font-bold text-gray-800">{slot.subject}</div>
                                                        <div className="text-xs text-gray-600">{slot.faculty}</div>
                                                        <div className="text-xs text-gray-500">{slot.room}</div>
                                                    </div>
                                                ) : <span className="text-gray-300">-</span>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Layout>
    );
}
