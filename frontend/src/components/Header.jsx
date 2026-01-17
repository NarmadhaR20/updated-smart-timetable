import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    // Get user info
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';
    const username = user.username || 'Guest';

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    // Don't show header on login page
    if (location.pathname === '/') return null;

    return (
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 z-20 relative">
            {/* Title / Breadcrumb Placeholder */}
            <div className="text-xl font-bold text-gray-700">
                AI Timetable Generator
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orodha-purple/10 flex items-center justify-center text-orodha-purple font-bold">
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">Welcome {role}, {username}</p>
                        <p className="text-xs text-gray-500">{role}</p>
                    </div>
                </div>

                <div className="h-8 w-px bg-gray-200"></div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium transition"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
}
