import logo from './logo.svg';
import './App.css';

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-green-600 text-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">🚀 Tailwind is Working!</h1>
        <p className="text-lg mb-6">
          This project is now styled with <span className="font-semibold">Tailwind CSS</span>.
        </p>
        <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-green-200 transition">
          Click Me
        </button>
      </div>
    </div>
  );
}

