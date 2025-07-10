export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tailwind Test</h1>
        <p className="text-gray-600 mb-6">This page tests if Tailwind CSS is working correctly.</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Click Me
        </button>
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          If you see styling on this page, Tailwind is working!
        </div>
      </div>
    </div>
  );
}
