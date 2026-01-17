import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function Auth() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '', email: '', role: 'student' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const res = await loginUser({ username: formData.username, password: formData.password });
                if (res.status === 'success') {
                    localStorage.setItem('user', JSON.stringify(res));
                    navigate('/dashboard');
                }
            } else {
                await registerUser({
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                    role: formData.role || 'student'
                });
                alert('Registration Successful! Please Login.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Left Side - Brand */}
            <div className="w-1/2 bg-gradient-to-br from-orodha-purple to-purple-800 flex flex-col justify-center items-center text-white p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <Calendar size={120} className="mb-8 text-orodha-pink drop-shadow-2xl" />
                    <h1 className="text-4xl font-extrabold mb-4 tracking-tight">AI Timetable</h1>
                    <h2 className="text-2xl font-light opacity-90">Generator</h2>
                </div>

                <div className="mt-16 space-y-4 w-64">
                    <button
                        onClick={() => { setIsLogin(true); setError(''); }}
                        className={`w-full py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl ${isLogin ? 'bg-orodha-pink text-white' : 'bg-purple-900/50 text-purple-200 border border-purple-400/30'}`}
                    >
                        LOGIN
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(''); }}
                        className={`w-full py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl ${!isLogin ? 'bg-amber-400 text-purple-900' : 'bg-purple-900/50 text-purple-200 border border-purple-400/30'}`}
                    >
                        SIGN UP
                    </button>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-1/2 bg-white flex items-center justify-center p-12">
                <div className="w-full max-w-md space-y-8 animate-in slide-in-from-right duration-500">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-800 mb-2">{isLogin ? 'Sign In' : 'Create Account'}</h2>
                        <p className="text-gray-500">Welcome to the Intelligent Timetable System</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        <div>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-gray-400">👤</span>
                                <input
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-orodha-purple focus:ring-2 focus:ring-purple-200 outline-none transition"
                                    placeholder="Username"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-gray-400">🔒</span>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-orodha-purple focus:ring-2 focus:ring-purple-200 outline-none transition"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <>
                                <div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-gray-400">📧</span>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-orodha-purple focus:ring-2 focus:ring-purple-200 outline-none transition"
                                            placeholder="Email Address"
                                        />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <label className="block text-gray-600 mb-1 text-sm font-bold">Select Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orodha-purple focus:ring-2 focus:ring-purple-200 outline-none transition bg-white"
                                    >
                                        <option value="student">Student (Viewer)</option>
                                        <option value="faculty">Faculty (Generator)</option>
                                        <option value="admin">Admin (Data Entry)</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <button
                            disabled={loading}
                            className="w-full bg-orodha-pink hover:bg-pink-600 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 disabled:opacity-50"
                        >
                            {loading ? 'PROCESSING...' : (isLogin ? 'LOGIN' : 'REGISTER')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
