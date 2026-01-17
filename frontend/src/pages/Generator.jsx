import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function Generator() {
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [facultyList, setFacultyList] = useState([]);

    const [config, setConfig] = useState({ department_code: '', semester: '' });
    const [allocations, setAllocations] = useState({}); // { subject_code: faculty_id }

    const [generatedTimetable, setGeneratedTimetable] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.getDepartments().then(res => setDepartments(res || []));
    }, []);

    // Load subjects and faculty when dept/sem changes
    useEffect(() => {
        if (config.department_code) {
            api.getSubjects(config.department_code).then(res => {
                // Filter by semester if selected
                const filtered = config.semester ? res.filter(s => s.semester === parseInt(config.semester)) : res;
                setSubjects(filtered);
            });
            api.getFaculty(config.department_code).then(res => setFacultyList(res || []));
        }
    }, [config.department_code, config.semester]);

    const handleAllocationChange = (subjectCode, facultyId) => {
        setAllocations(prev => ({ ...prev, [subjectCode]: facultyId }));
    };

    const handleGenerate = async () => {
        if (!config.department_code || !config.semester) {
            alert("Please select Department and Semester");
            return;
        }

        const payload = {
            department_code: config.department_code,
            semester: parseInt(config.semester),
            subject_allocations: Object.entries(allocations).map(([code, fid]) => ({
                subject_code: code,
                faculty_id: fid
            }))
        };

        setLoading(true);
        try {
            const res = await api.generateTimetable(payload);
            setGeneratedTimetable(res.schedule);
            alert("Timetable Generated Successfully!");
        } catch (err) {
            console.error(err);
            alert("Generation Failed: " + (err.response?.data?.detail || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Generate Timetable">
            <div className="flex flex-col gap-6">
                {/* Configuration Panel */}
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">1. Configuration</h2>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold mb-1">Department</label>
                            <select
                                className="w-full border p-2 rounded"
                                value={config.department_code}
                                onChange={e => setConfig({ ...config, department_code: e.target.value })}
                            >
                                <option value="">Select Department</option>
                                {departments.map(d => <option key={d.id} value={d.code}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold mb-1">Semester</label>
                            <select
                                className="w-full border p-2 rounded"
                                value={config.semester}
                                onChange={e => setConfig({ ...config, semester: e.target.value })}
                            >
                                <option value="">Select Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Subject Allocation Panel */}
                {subjects.length > 0 && (
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-bold mb-4 text-gray-700">2. Assign Faculty to Subjects</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {subjects.map(sub => (
                                <div key={sub.id} className="border p-4 rounded bg-gray-50 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold">{sub.name}</p>
                                        <p className="text-xs text-gray-500">{sub.code} • {sub.type}</p>
                                    </div>
                                    <select
                                        className="border p-2 rounded w-1/2"
                                        value={allocations[sub.code] || ''}
                                        onChange={e => handleAllocationChange(sub.code, e.target.value)}
                                    >
                                        <option value="">Select Faculty</option>
                                        {facultyList.map(f => (
                                            <option key={f.id} value={f.id}>{f.name}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className={`w-full py-3 rounded text-white font-bold text-lg shadow ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                    }`}
                            >
                                {loading ? 'GENERATING...' : 'GENERATE TIMETABLE 🚀'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Result Display */}
                {generatedTimetable && (
                    <div className="bg-white p-6 rounded shadow overflow-x-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-700">3. Generated Timetable</h2>
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
                                            const slot = generatedTimetable.find(s => s.day === day && s.period === period);
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
            </div>
        </Layout>
    );
}
