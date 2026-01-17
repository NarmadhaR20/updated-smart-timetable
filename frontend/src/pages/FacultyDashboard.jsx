export default function FacultyDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Faculty Dashboard</h1>
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Update Preferences</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Preferred Max Classes/Day</label>
                        <input type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Save Preferences</button>
                </form>
            </div>
        </div>
    );
}
