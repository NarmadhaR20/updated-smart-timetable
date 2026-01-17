import { useState } from 'react';
import { generateTimetable } from '../services/api';

export default function GenerateButton() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setMessage('');
        try {
            const res = await generateTimetable();
            setMessage(res.data.status === 'success' ? 'Timetable Generated Successfully!' : 'Generation Failed: ' + res.data.message);
        } catch (error) {
            setMessage('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-center my-6">
            <button
                onClick={handleGenerate}
                disabled={loading}
                className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition transform hover:scale-105 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'}`}
            >
                {loading ? 'Generating...' : '✨ Generate Timetable'}
            </button>
            {message && <p className={`mt-4 font-medium ${message.includes('Error') || message.includes('Failed') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
        </div>
    );
}
