import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { DataTable } from '../components/DataTable';
import { getFaculty, getDepartments, addFaculty, updateFaculty, deleteFaculty } from '../services/api';

export default function Faculty() {
    const [faculty, setFaculty] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '', email: '', designation: 'Professor',
        department_code: '', max_load_per_week: 12
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [facRes, deptRes] = await Promise.all([
                getFaculty(),
                getDepartments()
            ]);
            setFaculty(facRes);
            setDepartments(deptRes);
            if (!editingId && deptRes.length > 0 && !formData.department_code) {
                setFormData(prev => ({ ...prev, department_code: deptRes[0].code }));
            }
        } catch (err) { console.error(err); }
    };


    const handleSubmit = async () => {
        if (!formData.name || !formData.department_code) {
            alert("Name and Department are required");
            return;
        }
        try {
            const payload = {
                ...formData,
                max_load_per_week: parseInt(formData.max_load_per_week)
            };

            if (editingId) {
                await updateFaculty(editingId, payload);
                alert('Faculty Updated');
            } else {
                await addFaculty(payload);
                alert('Faculty Added');
            }

            setFormData({ name: '', email: '', designation: 'Professor', department_code: departments[0]?.code || '', max_load_per_week: 12 });
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


    const user = JSON.parse(localStorage.getItem('user')) || { role: 'faculty' };
    const isAdmin = user.role === 'admin';

    return (
        <Layout title="Manage Faculty">
            <div className="flex gap-8">
                {isAdmin && (
                    <div className="w-1/3 bg-white p-6 rounded shadow h-fit max-h-screen overflow-y-auto">
                        <h3 className="font-bold text-lg mb-4 text-orodha-purple">{editingId ? 'Edit Faculty' : 'Add Faculty'}</h3>
                        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1 tracking-tight">Name</label>
                                <input className="w-full border p-2 rounded focus:ring-2 focus:ring-orodha-purple outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1 tracking-tight">Email</label>
                                <input className="w-full border p-2 rounded focus:ring-2 focus:ring-orodha-purple outline-none" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1 tracking-tight">Designation</label>
                                <input className="w-full border p-2 rounded focus:ring-2 focus:ring-orodha-purple outline-none" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1 tracking-tight">Department</label>
                                <select className="w-full border p-2 rounded focus:ring-2 focus:ring-orodha-purple outline-none" value={formData.department_code} onChange={e => setFormData({ ...formData, department_code: e.target.value })}>
                                    {departments.map(d => <option key={d.id} value={d.code}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1 tracking-tight">Max Load/Week</label>
                                <input type="number" className="w-full border p-2 rounded focus:ring-2 focus:ring-orodha-purple outline-none" value={formData.max_load_per_week} onChange={e => setFormData({ ...formData, max_load_per_week: e.target.value })} />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button onClick={handleSubmit} className="flex-1 bg-orodha-purple text-white py-3 rounded-lg font-bold shadow-lg transition active:scale-95">{editingId ? 'UPDATE' : 'ADD'}</button>
                                {editingId && <button onClick={() => { setEditingId(null); setFormData(prev => ({ ...prev, name: '', email: '', designation: 'Professor', max_load_per_week: 12 })); }} className="bg-gray-100 text-gray-600 px-4 rounded-lg font-bold">Cancel</button>}
                            </div>
                        </form>
                    </div>
                )}
                <div className={isAdmin ? "flex-1" : "w-full"}>
                    <DataTable
                        headers={['Name', 'Email', 'Designation', 'Dept', 'Load']}
                        data={faculty.map(f => ({
                            ...f,
                            dept: f.department_code,
                            load: f.max_load_per_week
                        }))}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        showActions={isAdmin}
                    />
                </div>
            </div>
        </Layout>
    );
}
