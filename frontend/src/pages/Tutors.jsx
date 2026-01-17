import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { DataTable, ActionButtons } from '../components/DataTable';
import { getTutors, addTutor } from '../services/api';

export default function Tutors() {
    const [tutors, setTutors] = useState([]);
    const [formData, setFormData] = useState({ phone_no: '', name: '', unit_code: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await getTutors();
        setTutors(res.data || res); // Handle axios wrapper or direct mock
    };

    const handleAdd = async () => {
        try {
            await addTutor(formData);
            alert('Tutor Added Successfully');
            setFormData({ phone_no: '', name: '', unit_code: '' });
            loadData(); // Refresh list
        } catch (error) {
            console.error(error);
            alert("Failed to add Tutor. Check console for details.");
        }
    };

    return (
        <Layout title="Tutors">
            <div className="flex gap-8">
                {/* Form Section - LEFT */}
                <div className="w-1/3 bg-white p-6 rounded-lg shadow-sm h-fit">
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-gray-600 mb-1">Phone no.:</label>
                            <input
                                className="w-full border rounded p-2 focus:ring-2 focus:ring-orodha-blue outline-none"
                                value={formData.phone_no}
                                onChange={e => setFormData({ ...formData, phone_no: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Name:</label>
                            <input
                                className="w-full border rounded p-2 focus:ring-2 focus:ring-orodha-blue outline-none"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Unit Code:</label>
                            <input
                                className="w-full border rounded p-2 focus:ring-2 focus:ring-orodha-blue outline-none"
                                value={formData.unit_code}
                                onChange={e => setFormData({ ...formData, unit_code: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-2 pt-4">
                            <button onClick={handleAdd} className="flex-1 bg-orodha-blue hover:bg-blue-600 text-white py-2 rounded shadow font-semibold">ADD TUTOR</button>
                            <button className="flex-1 bg-orodha-blue hover:bg-blue-600 text-white py-2 rounded shadow font-semibold">EDIT</button>
                            <button className="flex-1 bg-orodha-blue hover:bg-blue-600 text-white py-2 rounded shadow font-semibold">UPDATE</button>
                            <button className="flex-1 bg-orodha-blue hover:bg-blue-600 text-white py-2 rounded shadow font-semibold">DELETE</button>
                        </div>
                    </form>
                </div>

                {/* Table Section - RIGHT */}
                <div className="flex-1">
                    <div className="bg-orodha-blue h-2 w-full rounded-t-lg"></div> {/* Decorative Header Line */}
                    <DataTable
                        headers={['ID', 'Phone no', 'Name', 'Unit Code']}
                        data={tutors}
                        onEdit={() => { }}
                        onDelete={() => { }}
                    />
                    <div className="bg-gray-400 h-64 w-full mt-4 rounded flex items-center justify-center text-white/50">
                        (Screenshot placeholder area)
                    </div>
                </div>
            </div>
        </Layout>
    );
}
