import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 mb-6"
            >
                AI-Powered Smart Timetable
            </motion.h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Generate conflict-free schedules for your department in minutes using our intelligent constraint-based system.
            </p>

            <div className="flex gap-4">
                <Link to="/timetable" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition">
                    View Timetable
                </Link>
                <Link to="/faculty" className="px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg shadow hover:bg-gray-50 transition">
                    Faculty Login
                </Link>
            </div>
        </div>
    );
}
