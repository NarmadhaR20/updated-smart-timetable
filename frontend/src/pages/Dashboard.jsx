import Layout from '../components/Layout';

export default function Dashboard() {
    return (
        <Layout title="Dashboard Overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Total Lectures", count: 24, color: "bg-blue-500" },
                    { title: "Active Tutors", count: 12, color: "bg-green-500" },
                    { title: "Rooms Available", count: 8, color: "bg-amber-500" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orodha-purple flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 font-medium">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-gray-800">{stat.count}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-full ${stat.color} opacity-20`}></div>
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <h2 className="text-2xl font-bold text-gray-400">Welcome to the Orodha System</h2>
                <p className="text-gray-400 mt-2">Select an option from the sidebar to begin managing your timetable data.</p>
            </div>
        </Layout>
    );
}
