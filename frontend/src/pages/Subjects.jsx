import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { DataTable } from '../components/DataTable';
import { getSubjects, addSubject, updateSubject, deleteSubject, getDepartments } from '../services/api';

export default function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({ name: '', code: '', type: 'Theory', weekly_hours: 3, department_code: '', semester: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [subRes, deptRes] = await Promise.all([
                getSubjects(),
                getDepartments()
            ]);
            setSubjects(subRes);
            setDepartments(deptRes);
            if (!editingId && deptRes.length > 0 && !formData.department_code) {
                setFormData(prev => ({ ...prev, department_code: deptRes[0].code }));
            }
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.code || !formData.department_code || !formData.semester) {
            alert("Please fill all fields");
            return;
        }

        try {
            const payload = {
                ...formData,
                weekly_hours: parseInt(formData.weekly_hours),
                semester: parseInt(formData.semester)
            };

            if (editingId) {
                await updateSubject(editingId, payload);
                alert('Subject Updated');
            } else {
                await addSubject(payload);
                alert('Subject Added');
            }
            setFormData({ name: '', code: '', type: 'Theory', weekly_hours: 3, department_code: departments[0]?.code || '', semester: '' });
            setEditingId(null);
            loadData();
        } catch (e) { alert('Error: ' + e.message); }
    };

    const handleEdit = (sub) => {
        setFormData({
            name: sub.name,
            code: sub.code,
            type: sub.type,
            weekly_hours: sub.weekly_hours,
            department_code: sub.department_code,
            semester: sub.semester
        });
        setEditingId(sub.id);
    };

    const handleDelete = async (row) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await deleteSubject(row.id);
            alert("Deleted");
            loadData();
        } catch (e) { alert("Delete failed: " + e.message); }
    };

    return (
        <Layout title="Manage Subjects">
            <div className="flex gap-8">
                <div className="w-1/3 bg-white p-6 rounded shadow h-fit">
                    <h3 className="font-bold text-lg mb-4">{editingId ? 'Edit Subject' : 'Add Subject'}</h3>
                    <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                        <label className="block">Subject Name: <input className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></label>
                        <label className="block">Subject Code: <input className="w-full border p-2 rounded" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} /></label>
                        <label className="block">Type:
                            <select className="w-full border p-2 rounded" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                <option>Theory</option>
                                <option>Lab</option>
                            </select>
                        </label>
                        <label className="block">Weekly Hours: <input type="number" className="w-full border p-2 rounded" value={formData.weekly_hours} onChange={e => setFormData({ ...formData, weekly_hours: e.target.value })} /></label>
                        <label className="block">Department:
                            <select className="w-full border p-2 rounded" value={formData.department_code} onChange={e => setFormData({ ...formData, department_code: e.target.value })}>
                                {departments.map(d => <option key={d.id} value={d.code}>{d.name}</option>)}
                            </select>
                        </label>
                        <label className="block">Semester: <input type="number" className="w-full border p-2 rounded" value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })} /></label>

                        <div className="flex gap-2">
                            <button onClick={handleSubmit} className="flex-1 bg-orodha-purple text-white py-2 rounded font-bold">{editingId ? 'UPDATE' : 'ADD'}</button>
                            {editingId && <button onClick={() => { setEditingId(null); setFormData(prev => ({ ...prev, name: '', code: '', semester: '' })); }} className="bg-gray-500 text-white px-4 rounded">Cancel</button>}
                        </div>
                    </form>
                </div>
                <div className="flex-1">
                    <DataTable
                        headers={['Name', 'Code', 'Type', 'Hours', 'Dept', 'Sem']}
                        data={subjects}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </Layout>
    );
}
