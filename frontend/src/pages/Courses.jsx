import { useState } from 'react';
import Layout from '../components/Layout';
import { DataTable } from '../components/DataTable';

export default function Courses() {
    const [courses] = useState([
        { id: 1, course_code: 'SC212', course_name: 'BSC IN SOFTWARE ENG.', units: 'SC102' },
        { id: 2, course_code: 'SC211', course_name: 'BSC IN IT', units: 'SC102' },
    ]);

    return (
        <Layout title="Courses (Programmes)">
            <div className="flex gap-8">
                <div className="w-1/3 bg-white p-6 rounded-lg shadow-sm h-fit">
                    <form className="space-y-4">
                        <div>
                            <label className="block text-gray-600 mb-1">Course Code:</label>
                            <input className="w-full border rounded p-2 focus:ring-2 focus:ring-orodha-blue outline-none" />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Course Name:</label>
                            <input className="w-full border rounded p-2 focus:ring-2 focus:ring-orodha-blue outline-none" />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Units:</label>
                            <input className="w-full border rounded p-2 focus:ring-2 focus:ring-orodha-blue outline-none" />
                        </div>

                        <button className="w-full bg-orodha-blue hover:bg-blue-600 text-white py-2 rounded shadow font-semibold">ADD COURSE</button>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-orodha-blue hover:bg-blue-600 text-white py-2 rounded shadow font-semibold">EDIT</button>
                            <button className="flex-1 bg-orodha-blue hover:bg-blue-600 text-white py-2 rounded shadow font-semibold">UPDATE</button>
                            <button className="flex-1 bg-orodha-blue hover:bg-blue-600 text-white py-2 rounded shadow font-semibold">DELETE</button>
                        </div>
                    </form>
                </div>

                <div className="flex-1">
                    <DataTable
                        headers={['ID', 'Course Code', 'Course Name', 'Units']}
                        data={courses}
                        onEdit={() => { }}
                        onDelete={() => { }}
                    />
                </div>
            </div>
        </Layout>
    );
}
