
import express, { Request, Response } from 'express';
import ViteExpress from 'vite-express';

const app = express()

app.use(express.json());

type Meal = {
  id: string;
  date: string;
  meal: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
};

let meals: Meal[] = [
  // 2025-09-08
  {
    id: "dummy5",
    date: "2025-09-08",
    meal: "breakfast",
    foodName: "Bagel",
    quantity: 1,
    unit: "item(s)",
    calories: 250
  },
  {
    id: "dummy6",
    date: "2025-09-08",
    meal: "lunch",
    foodName: "Turkey Sandwich",
    quantity: 1,
    unit: "item(s)",
    calories: 400
  },
  {
    id: "dummy7",
    date: "2025-09-08",
    meal: "dinner",
    foodName: "Salmon",
    quantity: 6,
    unit: "oz(s)",
    calories: 350
  },
  // 2025-09-09
  {
    id: "dummy3",
    date: "2025-09-09",
    meal: "dinner",
    foodName: "Steak",
    quantity: 8,
    unit: "oz(s)",
    calories: 600
  },
  {
    id: "dummy4",
    date: "2025-09-09",
    meal: "snack",
    foodName: "Apple",
    quantity: 1,
    unit: "item(s)",
    calories: 95
  },
  {
    id: "dummy8",
    date: "2025-09-09",
    meal: "breakfast",
    foodName: "Eggs",
    quantity: 2,
    unit: "item(s)",
    calories: 180
  },
  // 2025-09-10
  {
    id: "dummy1",
    date: "2025-09-10",
    meal: "breakfast",
    foodName: "Oatmeal",
    quantity: 1,
    unit: "cup(s)",
    calories: 150
  },
  {
    id: "dummy2",
    date: "2025-09-10",
    meal: "lunch",
    foodName: "Chicken Salad",
    quantity: 1,
    unit: "lb(s)",
    calories: 350
  },
  {
    id: "dummy9",
    date: "2025-09-10",
    meal: "dinner",
    foodName: "Pasta",
    quantity: 2,
    unit: "cup(s)",
    calories: 400
  },
  // 2025-09-11
  {
    id: "dummy10",
    date: "2025-09-11",
    meal: "breakfast",
    foodName: "Pancakes",
    quantity: 3,
    unit: "item(s)",
    calories: 350
  },
  {
    id: "dummy11",
    date: "2025-09-11",
    meal: "lunch",
    foodName: "Caesar Salad",
    quantity: 1,
    unit: "bowl(s)",
    calories: 320
  },
  {
    id: "dummy12",
    date: "2025-09-11",
    meal: "dinner",
    foodName: "Pizza",
    quantity: 2,
    unit: "slice(s)",
    calories: 500
  }
];


type GroupedMeals = {
  [date: string]: {
    meals: Meal[];
    totalCalories: number;
  };
};

const groupMealsByDate = (): GroupedMeals => {
  const grouped: GroupedMeals = {};
  meals.forEach((meal) => {
    if (!grouped[meal.date]) grouped[meal.date] = { meals: [], totalCalories: 0 };
    grouped[meal.date].meals.push(meal);
    grouped[meal.date].totalCalories += meal.calories || 0;
  });
  return grouped;
};


app.get('/meals', (req: Request, res: Response) => {
  const grouped = groupMealsByDate();
  res.json(grouped);
});


app.post('/submit', (req: Request, res: Response) => {
  const receivedData = req.body;

  const id = Date.now() + Math.random().toString(36).slice(2);
  const date = new Date().toISOString().split('T')[0];
  meals.push({ ...receivedData, id, date });

  const grouped = groupMealsByDate();
  res.json(grouped);
});


app.post('/delete', (req: Request, res: Response) => {
  const { id } = req.body;
  meals = meals.filter((meal) => meal.id !== id);

  const grouped = groupMealsByDate();
  res.json(grouped);
});


app.post('/update', (req: Request, res: Response) => {
  const updated = req.body;
  meals = meals.map((meal) => meal.id === updated.id ? { ...meal, ...updated } : meal);

  const grouped = groupMealsByDate();
  res.json(grouped);
});

ViteExpress.listen(app, 3000);