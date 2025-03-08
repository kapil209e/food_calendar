import Header from "./components/Header";
import { ChevronRight, UtensilsCrossed, Calendar, Clock } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Plan Your Meals with Ease
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Save time and eat better with our simple meal planning tool
          </p>
          <Link
            href="/planner"
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Start Planning
            <ChevronRight className="ml-2" size={20} />
          </Link>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <UtensilsCrossed className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Recipe Collection</h3>
            <p className="text-gray-600">
              Access hundreds of delicious recipes and add your own favorites
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Weekly Planning</h3>
            <p className="text-gray-600">
              Plan your meals for the entire week in just a few minutes
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Save Time</h3>
            <p className="text-gray-600">
              Generate shopping lists and meal prep schedules automatically
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
