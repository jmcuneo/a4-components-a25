import React from "react";

type MealFormProps = {
  form: {
    meal: string;
    foodName: string;
    quantity: number;
    unit: string;
    calories: number;
  };
  editId: string | null;
  loading: boolean;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
};

const MealForm: React.FC<MealFormProps> = ({
  form,
  editId,
  loading,
  error,
  onChange,
  onSubmit,
  onCancelEdit,
}) => (
  <form
    className="bg-white rounded shadow p-6 mb-8 w-full max-w-md"
    onSubmit={onSubmit}
  >
    <div className="mb-4">
      <label className="block font-semibold mb-1">Meal</label>
      <select
        name="meal"
        value={form.meal}
        onChange={onChange}
        className="w-full border rounded px-2 py-1"
        required
      >
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
        <option value="snack">Snack</option>
      </select>
    </div>
    <div className="mb-4">
      <label className="block font-semibold mb-1">Food Name</label>
      <input
        name="foodName"
        value={form.foodName}
        onChange={onChange}
        className="w-full border rounded px-2 py-1"
        required
      />
    </div>
    <div className="mb-4 flex gap-2">
      <div className="flex-1">
        <label className="block font-semibold mb-1">Quantity</label>
        <input
          name="quantity"
          type="number"
          min={1}
          value={form.quantity}
          onChange={onChange}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>
      <div className="flex-1">
        <label className="block font-semibold mb-1">Unit</label>
        <select
          name="unit"
          value={form.unit}
          onChange={onChange}
          className="w-full border rounded px-2 py-1"
          required
        >
          <option value="item(s)">item(s)</option>
          <option value="cup(s)">cup(s)</option>
          <option value="oz(s)">oz(s)</option>
          <option value="lb(s)">lb(s)</option>
          <option value="bowl(s)">bowl(s)</option>
          <option value="slice(s)">slice(s)</option>
        </select>
      </div>
    </div>
    <div className="mb-4">
      <label className="block font-semibold mb-1">Calories</label>
      <input
        name="calories"
        type="number"
        min={0}
        value={form.calories}
        onChange={onChange}
        className="w-full border rounded px-2 py-1"
        required
      />
    </div>
    <div className="flex gap-2">
      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        disabled={loading}
      >
        {editId ? "Update Meal" : "Add Meal"}
      </button>
      {editId && (
        <button
          type="button"
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          onClick={onCancelEdit}
          disabled={loading}
        >
          Cancel
        </button>
      )}
    </div>
    {error && <div className="text-red-500 mt-2">{error}</div>}
  </form>
);

export default MealForm;
