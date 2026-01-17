import AddDepartmentForm from '../components/AddDepartmentForm';
import AddFacultyForm from '../components/AddFacultyForm';
import GenerateButton from '../components/GenerateButton';

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <GenerateButton />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4">Manage Departments</h2>
                    <AddDepartmentForm />
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4">Manage Faculty</h2>
                    <AddFacultyForm />
                </div>
            </div>
        </div>
    );
}
