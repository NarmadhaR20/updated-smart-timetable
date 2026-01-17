import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { LogOut } from 'lucide-react';

export default function Layout({ children, title }) {
    const navigate = useNavigate();
    let user = { username: 'Guest', role: 'Visitor' };
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) user = JSON.parse(storedUser);
    } catch (e) {
        console.error("Failed to parse user from local storage", e);
    }

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('user');
            navigate('/');
        }
    };

    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            <div className="flex-1 ml-64">
                <header className="bg-white p-6 shadow-sm border-b flex justify-between items-center sticky top-0 z-20">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 underline decoration-orodha-purple decoration-4 underline-offset-8">
                            {title || "Orodha Time-tabling System"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Welcome {capitalize(user.role)}</p>
                            <p className="text-lg font-bold text-orodha-purple">{user.name || capitalize(user.username)}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-full transition duration-300"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
