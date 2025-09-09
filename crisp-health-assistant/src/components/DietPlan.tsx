"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Clock, Utensils, Sparkles } from "lucide-react";
import { MealCard3D } from "./MealCard3D";
import { MealModal } from "./MealModal";

// Load meals data
import mealsData from "@/data/meals.json";

interface Meal {
  id: string;
  name: string;
  category: string;
  calories: number;
  prep_time: number;
  difficulty: string;
  image: string;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  tags: string[];
  ingredients: Array<{
    name: string;
    amount: string;
  }>;
  instructions: string[];
  alternatives?: string[];
}

const MEAL_CATEGORIES = [
  { id: "all", label: "All Meals", icon: "🍽️" },
  { id: "breakfast", label: "Breakfast", icon: "☀️" },
  { id: "lunch", label: "Lunch", icon: "🌤️" },
  { id: "dinner", label: "Dinner", icon: "🌙" },
  { id: "snacks", label: "Snacks", icon: "🍎" }
];

const DIFFICULTY_FILTERS = ["easy", "medium", "hard"];
const CALORIE_RANGES = [
  { id: "low", label: "Low (< 300)", min: 0, max: 299 },
  { id: "medium", label: "Medium (300-500)", min: 300, max: 500 },
  { id: "high", label: "High (> 500)", min: 501, max: 1000 }
];

export function DietPlan() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedCalorieRange, setSelectedCalorieRange] = useState<string[]>([]);
  const [maxPrepTime, setMaxPrepTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Flatten all meals from the JSON structure
  const allMeals: Meal[] = React.useMemo(() => {
    return [
      ...(mealsData.breakfast || []),
      ...(mealsData.lunch || []),
      ...(mealsData.dinner || []),
      ...(mealsData.snacks || [])
    ];
  }, []);

  // Filter meals based on current selections
  useEffect(() => {
    let filtered = [...allMeals];

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(meal => meal.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(meal =>
        meal.name.toLowerCase().includes(query) ||
        meal.tags.some(tag => tag.toLowerCase().includes(query)) ||
        meal.ingredients.some(ingredient => 
          ingredient.name.toLowerCase().includes(query)
        )
      );
    }

    // Difficulty filter
    if (selectedDifficulty.length > 0) {
      filtered = filtered.filter(meal =>
        selectedDifficulty.includes(meal.difficulty)
      );
    }

    // Calorie range filter
    if (selectedCalorieRange.length > 0) {
      filtered = filtered.filter(meal => {
        return selectedCalorieRange.some(rangeId => {
          const range = CALORIE_RANGES.find(r => r.id === rangeId);
          return range && meal.calories >= range.min && meal.calories <= range.max;
        });
      });
    }

    // Prep time filter
    if (maxPrepTime) {
      filtered = filtered.filter(meal => meal.prep_time <= maxPrepTime);
    }

    setFilteredMeals(filtered);
    setIsLoading(false);
  }, [selectedCategory, searchQuery, selectedDifficulty, selectedCalorieRange, maxPrepTime, allMeals]);

  const handleMealClick = (meal: Meal) => {
    setSelectedMeal(meal);
  };

  const toggleDifficultyFilter = (difficulty: string) => {
    setSelectedDifficulty(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const toggleCalorieRangeFilter = (rangeId: string) => {
    setSelectedCalorieRange(prev =>
      prev.includes(rangeId)
        ? prev.filter(r => r !== rangeId)
        : [...prev, rangeId]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedDifficulty([]);
    setSelectedCalorieRange([]);
    setMaxPrepTime(null);
    setSelectedCategory("all");
  };

  const activeFiltersCount = selectedDifficulty.length + selectedCalorieRange.length + (maxPrepTime ? 1 : 0) + (searchQuery ? 1 : 0);

  return (
    <div className="container mx-auto px-4 py-2 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Diet Plan & Recipes
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Discover {allMeals.length}+ healthy and delicious meals with interactive 3D cards. 
          Filter by category, difficulty, or dietary preferences.
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
          {MEAL_CATEGORIES.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="flex items-center gap-2 text-sm"
            >
              <span>{category.icon}</span>
              <span className="hidden sm:inline">{category.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border mb-8">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search meals, ingredients, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Difficulty Filters */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Difficulty:</span>
            {DIFFICULTY_FILTERS.map((difficulty) => (
              <Badge
                key={difficulty}
                variant={selectedDifficulty.includes(difficulty) ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => toggleDifficultyFilter(difficulty)}
              >
                {difficulty}
              </Badge>
            ))}
          </div>

          {/* Calorie Range Filters */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Calories:</span>
            {CALORIE_RANGES.map((range) => (
              <Badge
                key={range.id}
                variant={selectedCalorieRange.includes(range.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleCalorieRangeFilter(range.id)}
              >
                {range.label}
              </Badge>
            ))}
          </div>

          {/* Prep Time Filter */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Max prep time:</span>
            <select
              value={maxPrepTime || ""}
              onChange={(e) => setMaxPrepTime(e.target.value ? parseInt(e.target.value) : null)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="">Any</option>
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>1 hour</option>
            </select>
          </div>
        </div>

        {/* Active Filters & Clear */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} applied
            </span>
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-emerald-600" />
          <span className="text-lg font-semibold">
            {filteredMeals.length} meal{filteredMeals.length !== 1 ? "s" : ""} found
          </span>
          {selectedCategory !== "all" && (
            <Badge variant="secondary">
              {MEAL_CATEGORIES.find(c => c.id === selectedCategory)?.label}
            </Badge>
          )}
        </div>
        
        {/* Quick AI Suggestion Button */}
        <Button variant="outline" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Get AI Suggestions
        </Button>
      </div>

      {/* Meals Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredMeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMeals.map((meal) => (
            <MealCard3D
              key={meal.id}
              meal={meal}
              onClick={handleMealClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold mb-2">No meals found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms
          </p>
          <Button onClick={clearAllFilters}>Clear all filters</Button>
        </div>
      )}

      {/* Meal Detail Modal */}
      {selectedMeal && (
        <MealModal
          meal={selectedMeal}
          isOpen={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
          alternativeMeals={allMeals.filter(m => 
            m.category === selectedMeal.category && 
            m.id !== selectedMeal.id
          ).slice(0, 3)}
        />
      )}
    </div>
  );
}
