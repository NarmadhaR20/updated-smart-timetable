import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { DataTable } from '../components/DataTable';
import { getFaculty, getDepartments, getSubjects, addFaculty, updateFaculty, deleteFaculty } from '../services/api';

export default function Faculty() {
    const [faculty, setFaculty] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]); // All subjects to pick from
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '', email: '', designation: 'Professor',
        department_code: '', max_load_per_week: 12
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [facRes, deptRes, subRes] = await Promise.all([
                getFaculty(),
                getDepartments(),
                getSubjects()
            ]);
            setFaculty(facRes);
            setDepartments(deptRes);
            setSubjects(subRes);
            if (!editingId && deptRes.length > 0 && !formData.department_code) {
                setFormData(prev => ({ ...prev, department_code: deptRes[0].code }));
            }
        } catch (err) { console.error(err); }
    };

    const toggleSubject = (code) => {
        if (selectedSubjects.includes(code)) {
            setSelectedSubjects(selectedSubjects.filter(s => s !== code));
        } else {
            setSelectedSubjects([...selectedSubjects, code]);
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.department_code) {
            alert("Name and Department are required");
            return;
        }
        try {
            const payload = {
                ...formData,
                max_load_per_week: parseInt(formData.max_load_per_week),
                qualified_subjects: selectedSubjects
            };

            if (editingId) {
                await updateFaculty(editingId, payload);
                alert('Faculty Updated');
            } else {
                await addFaculty(payload);
                alert('Faculty Added');
            }

            setFormData({ name: '', email: '', designation: 'Professor', department_code: departments[0]?.code || '', max_load_per_week: 12 });
            setSelectedSubjects([]);
            setEditingId(null);
            loadData();
        } catch (e) { alert('Error: ' + e.message); }
    };

    const handleEdit = (fac) => {
        setFormData({
            name: fac.name,
            email: fac.email,
            designation: fac.designation,
            department_code: fac.department_code,
            max_load_per_week: fac.max_load_per_week
        });
        setSelectedSubjects(fac.qualified_subjects ? String(fac.qualified_subjects).split(', ').filter(s => s) : []);
        setEditingId(fac.id);
    };

    const handleDelete = async (row) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await deleteFaculty(row.id);
            alert("Deleted");
            loadData();
        } catch (e) { alert("Delete failed: " + e.message); }
    };

    // Filter subjects by selected department for easier selection
    const filteredSubjects = subjects.filter(s => s.department_code === formData.department_code);

    return (
        <Layout title="Manage Faculty">
            <div className="flex gap-8">
                <div className="w-1/3 bg-white p-6 rounded shadow h-fit max-h-screen overflow-y-auto">
                    <h3 className="font-bold text-lg mb-4">{editingId ? 'Edit Faculty' : 'Add Faculty'}</h3>
                    <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                        <label className="block">Name: <input className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></label>
                        <label className="block">Email: <input className="w-full border p-2 rounded" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></label>
                        <label className="block">Designation: <input className="w-full border p-2 rounded" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} /></label>
                        <label className="block">Department:
                            <select className="w-full border p-2 rounded" value={formData.department_code} onChange={e => setFormData({ ...formData, department_code: e.target.value })}>
                                {departments.map(d => <option key={d.id} value={d.code}>{d.name}</option>)}
                            </select>
                        </label>
                        <label className="block">Max Load/Week: <input type="number" className="w-full border p-2 rounded" value={formData.max_load_per_week} onChange={e => setFormData({ ...formData, max_load_per_week: e.target.value })} /></label>

                        <div className="border p-2 rounded max-h-40 overflow-y-auto">
                            <p className="font-bold mb-2">Qualified Subjects:</p>
                            {filteredSubjects.map(s => (
                                <div key={s.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedSubjects.includes(s.code)}
                                        onChange={() => toggleSubject(s.code)}
                                    />
                                    <span>{s.code} - {s.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <button onClick={handleSubmit} className="flex-1 bg-orodha-purple text-white py-2 rounded font-bold">{editingId ? 'UPDATE' : 'ADD'}</button>
                            {editingId && <button onClick={() => { setEditingId(null); setFormData(prev => ({ ...prev, name: '', email: '' })); setSelectedSubjects([]); }} className="bg-gray-500 text-white px-4 rounded">Cancel</button>}
                        </div>
                    </form>
                </div>
                <div className="flex-1">
                    <DataTable
                        headers={['Name', 'Email', 'Dept', 'Load', 'Subjects']}
                        data={faculty.map(f => ({ ...f, qualified_subjects: f.qualified_subjects?.join(', ') }))}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </Layout>
    );
}
