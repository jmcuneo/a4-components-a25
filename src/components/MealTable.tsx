import React from "react";

type Meal = {
  id: string;
  date: string;
  meal: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
};

type GroupedMeals = {
  [date: string]: {
    meals: Meal[];
    totalCalories: number;
  };
};

type MealTableProps = {
  groupedMeals: GroupedMeals;
  loading: boolean;
  editId: string | null;
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
};

const MealTable: React.FC<MealTableProps> = ({ groupedMeals, loading, editId, onEdit, onDelete }) => (
  <div className="w-full max-w-3xl">
    {loading && <div className="text-center">Loading...</div>}
    {Object.keys(groupedMeals).length === 0 && !loading && (
      <div className="text-center text-gray-500">No meals yet.</div>
    )}
    {Object.entries(groupedMeals).map(([date, value]) => {
      const { meals, totalCalories } = value as { meals: Meal[]; totalCalories: number };
      return (
        <div key={date} className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{date}</h2>
          <table className="w-full bg-white rounded shadow overflow-hidden">
            <thead className="bg-orange-200">
              <tr>
                <th className="px-2 py-1 text-left">Meal</th>
                <th className="px-2 py-1 text-left">Food</th>
                <th className="px-2 py-1 text-right">Qty</th>
                <th className="px-2 py-1 text-left">Unit</th>
                <th className="px-2 py-1 text-right">Calories</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal: Meal) => (
                <tr key={meal.id} className="border-b last:border-b-0">
                  <td className="px-2 py-1">{meal.meal}</td>
                  <td className="px-2 py-1">{meal.foodName}</td>
                  <td className="px-2 py-1 text-right">{meal.quantity}</td>
                  <td className="px-2 py-1">{meal.unit}</td>
                  <td className="px-2 py-1 text-right">{meal.calories}</td>
                  <td className="px-2 py-1 flex gap-2 justify-center">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                      onClick={() => onEdit(meal)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                      onClick={() => onDelete(meal.id)}
                      disabled={loading || editId === meal.id}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-orange-100 font-bold">
                <td colSpan={4} className="px-2 py-1 text-right">Total Calories:</td>
                <td className="px-2 py-1 text-right">{totalCalories}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    })}
  </div>
);

export default MealTable;
