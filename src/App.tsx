
import { useEffect, useState } from "react";
import MealForm from "./components/MealForm";
import MealTable from "./components/MealTable";

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

const defaultForm = {
  meal: "breakfast",
  foodName: "",
  quantity: 1,
  unit: "item(s)",
  calories: 0,
};

function App() {
  const [groupedMeals, setGroupedMeals] = useState<GroupedMeals>({});
  const [form, setForm] = useState<typeof defaultForm>(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Fetch meals on mount
  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/meals");
      const data = await res.json();
      setGroupedMeals(data);
    } catch (e) {
      setError(`Failed to fetch meals: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: typeof defaultForm) => ({
      ...prev,
      [name]: name === "quantity" || name === "calories" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const url = editId ? "/update" : "/submit";
      const body = editId ? { ...form, id: editId } : form;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setGroupedMeals(data);
      setForm(defaultForm);
      setEditId(null);
    } catch (e) {
      setError("Failed to submit meal");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (meal: Meal) => {
    setForm({
      meal: meal.meal,
      foodName: meal.foodName,
      quantity: meal.quantity,
      unit: meal.unit,
      calories: meal.calories,
    });
    setEditId(meal.id);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      setGroupedMeals(data);
      if (editId === id) {
        setForm(defaultForm);
        setEditId(null);
      }
    } catch (e) {
      setError("Failed to delete meal");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setForm(defaultForm);
    setEditId(null);
  };
  
  const filteredGroupedMeals = selectedDate
    ? (groupedMeals[selectedDate]
        ? { [selectedDate]: groupedMeals[selectedDate] }
        : {})
    : groupedMeals;

  return (
    <div className="min-h-screen flex flex-col items-center bg-orange-100 py-8">
      <h1 className="text-4xl font-bold mb-4">Calorie Tracker</h1>
      <div className="mb-6">
        <label className="font-semibold mr-2">Show meals for date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
        {selectedDate && (
          <button
            className="ml-2 px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => setSelectedDate("")}
          >
            Clear
          </button>
        )}
      </div>
      <MealForm
        form={form}
        editId={editId}
        loading={loading}
        error={error}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancelEdit={handleCancelEdit}
      />
      <MealTable
        groupedMeals={filteredGroupedMeals}
        loading={loading}
        editId={editId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
