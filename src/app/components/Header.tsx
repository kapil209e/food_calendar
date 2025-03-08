import { Calendar, Home, Settings } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm mb-8">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-emerald-600">Meal Planner</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link 
              href="/planner" 
              className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600"
            >
              <Calendar size={20} />
              <span>Planner</span>
            </Link>
            <Link 
              href="/settings" 
              className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600"
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 