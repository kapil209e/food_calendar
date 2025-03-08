# Indian Meal Planner

A Next.js application to help plan your Indian meals for the week. Features include:

- Weekly meal planning calendar
- Extensive database of Indian recipes
- Meal suggestions based on preferences
- Filtering by region, spice level, and dietary restrictions
- Nutritional information for each meal
- Support for breakfast, lunch, and dinner options

Visit the live site: [Indian Meal Planner](https://food-calendar.vercel.app)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Hugging Face AI for meal suggestions

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/kapil209e/food_calendar.git
cd food_calendar
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file with:
```
HUGGINGFACE_API_KEY=your_api_key
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Features

- **Meal Calendar**: Plan your meals for the entire week
- **Smart Suggestions**: Get AI-powered meal suggestions based on your preferences
- **Dietary Preferences**: Filter meals based on:
  - Vegetarian/Non-vegetarian
  - Spice level
  - Cooking medium (oil/ghee)
  - Region (North/South/East/West Indian cuisine)
- **Nutritional Information**: View detailed nutritional content for each meal
- **Recipe Details**: Access cooking time, ingredients, and accompaniments

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.