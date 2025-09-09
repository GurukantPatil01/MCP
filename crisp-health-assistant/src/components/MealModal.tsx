"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Users,
  Flame,
  ChefHat,
  Star,
  Heart,
  Share2,
  CheckCircle,
  ArrowRight
} from "lucide-react";

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

interface MealModalProps {
  meal: Meal;
  isOpen: boolean;
  onClose: () => void;
  alternativeMeals: Meal[];
}

export function MealModal({ meal, isOpen, onClose, alternativeMeals }: MealModalProps) {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getCategoryIcon(meal.category)}</span>
                <Badge variant="secondary" className="capitalize">
                  {meal.category}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-bold leading-tight">
                {meal.name}
              </DialogTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-medium">{meal.calories} cal</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{meal.prep_time} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <Badge className={getDifficultyColor(meal.difficulty)} variant="outline">
                {meal.difficulty}
              </Badge>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {meal.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Meal Image */}
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900 h-64 flex items-center justify-center">
                <ChefHat className="w-16 h-16 text-emerald-600 dark:text-emerald-400 opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Nutrition Information */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Nutrition Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{meal.nutrition.protein}g</div>
                    <div className="text-sm text-muted-foreground">Protein</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{meal.nutrition.carbs}g</div>
                    <div className="text-sm text-muted-foreground">Carbs</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{meal.nutrition.fat}g</div>
                    <div className="text-sm text-muted-foreground">Fat</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{meal.nutrition.fiber}g</div>
                    <div className="text-sm text-muted-foreground">Fiber</div>
                  </div>
                </div>
              </div>

              {/* Quick Summary */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Quick Summary</h3>
                <p className="text-sm text-muted-foreground">
                  This {meal.difficulty} {meal.category} recipe takes approximately {meal.prep_time} minutes to prepare 
                  and contains {meal.calories} calories. Perfect for those looking for {meal.tags.slice(0, 3).join(", ")} options.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="ingredients" className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-emerald-500" />
                  Ingredients ({meal.ingredients.length} items)
                </h3>
                <div className="space-y-3">
                  {meal.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500 opacity-50" />
                      <span className="flex-1 font-medium">{ingredient.name}</span>
                      <span className="text-sm text-muted-foreground bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {ingredient.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shopping Tips */}
              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">Shopping Tips</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Most ingredients can be found in the produce and pantry sections. 
                  For best results, choose fresh, high-quality ingredients.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="instructions" className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  Step-by-step Instructions
                </h3>
                <div className="space-y-4">
                  {meal.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{instruction}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cooking Tips */}
              <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">Cooking Tips</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Prep all ingredients before starting. Follow the timing closely for best results.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="alternatives" className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h3 className="font-semibold mb-4">Similar Recipes</h3>
                {alternativeMeals.length > 0 ? (
                  <div className="space-y-3">
                {alternativeMeals.map((altMeal) => (
                      <div key={altMeal.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getCategoryIcon(altMeal.category)}</span>
                          <div>
                            <h4 className="font-medium">{altMeal.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{altMeal.calories} cal</span>
                              <span>•</span>
                              <span>{altMeal.prep_time} min</span>
                              <span>•</span>
                              <span className="capitalize">{altMeal.difficulty}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No similar recipes found in this category.
                  </p>
                )}
              </div>

              {/* Dietary Modifications */}
              <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-purple-800 dark:text-purple-200">Dietary Modifications</h4>
                <div className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                  <p><strong>Vegan:</strong> Substitute dairy products with plant-based alternatives</p>
                  <p><strong>Low-carb:</strong> Replace grains with cauliflower or zucchini alternatives</p>
                  <p><strong>Gluten-free:</strong> Use certified gluten-free substitutes for wheat products</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Add to Plan
            </Button>
            <Button variant="outline" size="sm">
              Save Recipe
            </Button>
          </div>
          <Button onClick={onClose} variant="default">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
