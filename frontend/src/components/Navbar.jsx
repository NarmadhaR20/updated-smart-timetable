import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-xl font-bold text-primary">Smart Timetable</Link>
                    <div className="flex space-x-4">
                        <Link to="/timetable" className="text-gray-600 hover:text-primary">Timetable</Link>
                        <Link to="/faculty" className="text-gray-600 hover:text-primary">Faculty</Link>
                        <Link to="/admin" className="text-gray-600 hover:text-primary">Admin</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
