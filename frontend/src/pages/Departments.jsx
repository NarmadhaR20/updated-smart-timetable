import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { DataTable } from '../components/DataTable';
import { getDepartments, addDepartment, updateDepartment, deleteDepartment } from '../services/api';

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({ name: '', code: '', semesters: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await getDepartments();
            setDepartments(res);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.code || !formData.semesters) {
            alert("Please fill all fields");
            return;
        }

        try {
            // Convert comma separated semesters string to array [1,2,3...]
            const sems = String(formData.semesters).split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            const payload = { ...formData, semesters: sems };

            if (editingId) {
                await updateDepartment(editingId, payload);
                alert('Department Updated');
            } else {
                await addDepartment(payload);
                alert('Department Added');
            }
            setFormData({ name: '', code: '', semesters: '' });
            setEditingId(null);
            loadData();
        } catch (e) { alert('Error: ' + e.message); }
    };

    const handleEdit = (dept) => {
        setFormData({
            name: dept.name,
            code: dept.code,
            semesters: dept.semesters // it's already a string due to table mapping
        });
        setEditingId(dept.id);
    };

    const handleDelete = async (row) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await deleteDepartment(row.id);
            alert("Deleted");
            loadData();
        } catch (e) { alert("Delete failed: " + e.message); }
    };

    const user = JSON.parse(localStorage.getItem('user')) || { role: 'faculty' };
    const isAdmin = user.role === 'admin';

    return (
        <Layout title="Manage Departments">
            <div className="flex gap-8">
                {isAdmin && (
                    <div className="w-1/3 bg-white p-6 rounded shadow h-fit">
                        <h3 className="font-bold text-lg mb-4">{editingId ? 'Edit Dept' : 'Add Dept'}</h3>
                        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                            <label className="block">Dept Name: <input className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Computer Science" /></label>
                            <label className="block">Dept Code: <input className="w-full border p-2 rounded" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="CS" /></label>
                            <label className="block">Semesters (comma list): <input className="w-full border p-2 rounded" value={formData.semesters} onChange={e => setFormData({ ...formData, semesters: e.target.value })} placeholder="1, 2, 3, 4, 5, 6, 7, 8" /></label>

                            <div className="flex gap-2">
                                <button onClick={handleSubmit} className="flex-1 bg-orodha-purple text-white py-2 rounded font-bold">{editingId ? 'UPDATE' : 'ADD'}</button>
                                {editingId && <button onClick={() => { setEditingId(null); setFormData({ name: '', code: '', semesters: '' }); }} className="bg-gray-500 text-white px-4 rounded">Cancel</button>}
                            </div>
                        </form>
                    </div>
                )}
                <div className="flex-1">
                    <DataTable
                        headers={['ID', 'Name', 'Code', 'Semesters']}
                        data={departments.map(d => ({ ...d, semesters: d.years?.join(', ') || d.semesters?.join(', ') }))}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        showActions={isAdmin}
                    />
                </div>
            </div>
        </Layout>
    );
}
