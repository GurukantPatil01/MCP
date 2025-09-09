"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame, Star, ChefHat } from "lucide-react";

interface Meal {
  id: string;
  name: string;
  image: string;
  calories: number;
  prep_time: number;
  difficulty: string;
  category: string;
  tags: string[];
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface MealCard3DProps {
  meal: Meal;
  onClick: (meal: Meal) => void;
}

export function MealCard3D({ meal, onClick }: MealCard3DProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "breakfast":
        return "☀️";
      case "lunch":
        return "🌤️";
      case "dinner":
        return "🌙";
      case "snack":
        return "🍎";
      default:
        return "🍽️";
    }
  };

  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[20rem] h-auto rounded-xl p-6 border cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
        {/* Category Badge */}
        <CardItem
          translateZ="10"
          className="absolute top-4 left-4 z-10"
        >
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm text-xs font-medium">
            <span>{getCategoryIcon(meal.category)}</span>
            <span className="capitalize">{meal.category}</span>
          </div>
        </CardItem>

        {/* Meal Image */}
        <CardItem translateZ="100" className="w-full mt-4">
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950 dark:to-emerald-950 h-48 flex items-center justify-center">
            {/* Placeholder for when images are not available */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900">
              <ChefHat className="w-12 h-12 text-emerald-600 dark:text-emerald-400 opacity-50" />
            </div>
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Calories badge on image */}
            <CardItem
              translateZ="20"
              className="absolute bottom-2 right-2"
            >
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 text-white text-xs font-medium backdrop-blur-sm">
                <Flame className="w-3 h-3 text-orange-400" />
                {meal.calories}
              </div>
            </CardItem>
          </div>
        </CardItem>

        {/* Meal Title */}
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-900 dark:text-white mt-4 leading-tight"
        >
          {meal.name}
        </CardItem>

        {/* Meal Stats Row */}
        <div className="flex justify-between items-center mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          <CardItem translateZ="20" className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>{meal.prep_time} min</span>
          </CardItem>
          
          <CardItem translateZ="20" className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="capitalize">{meal.difficulty}</span>
          </CardItem>
        </div>

        {/* Nutrition Quick View */}
        <CardItem translateZ="30" className="mt-3">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50">
              <div className="font-semibold text-blue-700 dark:text-blue-300">{meal.nutrition.protein}g</div>
              <div className="text-blue-600 dark:text-blue-400">Protein</div>
            </div>
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/50">
              <div className="font-semibold text-green-700 dark:text-green-300">{meal.nutrition.carbs}g</div>
              <div className="text-green-600 dark:text-green-400">Carbs</div>
            </div>
            <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/50">
              <div className="font-semibold text-yellow-700 dark:text-yellow-300">{meal.nutrition.fat}g</div>
              <div className="text-yellow-600 dark:text-yellow-400">Fat</div>
            </div>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50">
              <div className="font-semibold text-purple-700 dark:text-purple-300">{meal.nutrition.fiber}g</div>
              <div className="text-purple-600 dark:text-purple-400">Fiber</div>
            </div>
          </div>
        </CardItem>

        {/* Tags */}
        <CardItem translateZ="30" className="flex gap-1 mt-4 flex-wrap">
          <Badge className={getDifficultyColor(meal.difficulty)}>
            {meal.difficulty}
          </Badge>
          {meal.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </CardItem>

        {/* Action Button */}
        <CardItem
          translateZ={20}
          as="button"
          onClick={() => onClick(meal)}
          className="w-full mt-6 px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm font-medium hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-center gap-2">
            <span>View Recipe</span>
            <svg
              className="w-4 h-4 transition-transform group-hover/card:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
