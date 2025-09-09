"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealTools = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class MealTools {
    constructor(openAIService) {
        this.openAIService = openAIService;
        this.mealsDatabase = null;
    }
    async loadMealsDatabase() {
        if (this.mealsDatabase) {
            return this.mealsDatabase;
        }
        try {
            // Try to load from the frontend data directory
            const mealDataPath = path.join(__dirname, '../../..', 'src', 'data', 'meals.json');
            if (fs.existsSync(mealDataPath)) {
                const data = fs.readFileSync(mealDataPath, 'utf8');
                this.mealsDatabase = JSON.parse(data);
                return this.mealsDatabase;
            }
            // Fallback to a basic meal database if frontend file doesn't exist
            this.mealsDatabase = this.getFallbackMealsDatabase();
            return this.mealsDatabase;
        }
        catch (error) {
            console.warn('Failed to load meals database, using fallback:', error);
            this.mealsDatabase = this.getFallbackMealsDatabase();
            return this.mealsDatabase;
        }
    }
    getFallbackMealsDatabase() {
        return {
            breakfast: [
                {
                    id: "breakfast_001",
                    name: "Avocado Toast with Eggs",
                    category: "breakfast",
                    calories: 420,
                    prep_time: 10,
                    difficulty: "easy",
                    nutrition: { protein: 18, carbs: 35, fat: 24, fiber: 12 },
                    tags: ["vegetarian", "high-protein", "quick"],
                    ingredients: [
                        { name: "Whole grain bread", amount: "2 slices" },
                        { name: "Avocado", amount: "1 medium" },
                        { name: "Eggs", amount: "2 large" }
                    ],
                    instructions: [
                        "Toast bread until golden brown",
                        "Mash avocado with lime juice, salt, and pepper",
                        "Cook eggs to your preference",
                        "Spread avocado on toast, top with eggs"
                    ]
                }
            ],
            lunch: [
                {
                    id: "lunch_001",
                    name: "Mediterranean Quinoa Salad",
                    category: "lunch",
                    calories: 450,
                    prep_time: 15,
                    difficulty: "easy",
                    nutrition: { protein: 16, carbs: 55, fat: 18, fiber: 8 },
                    tags: ["vegetarian", "mediterranean", "meal-prep"],
                    ingredients: [
                        { name: "Cooked quinoa", amount: "1 cup" },
                        { name: "Cucumber", amount: "1 medium diced" },
                        { name: "Cherry tomatoes", amount: "1 cup halved" }
                    ],
                    instructions: [
                        "Mix quinoa, cucumber, tomatoes, and onion",
                        "Add feta cheese",
                        "Whisk olive oil and lemon juice",
                        "Toss with dressing and serve"
                    ]
                }
            ],
            dinner: [
                {
                    id: "dinner_001",
                    name: "Herb-Crusted Chicken with Roasted Vegetables",
                    category: "dinner",
                    calories: 520,
                    prep_time: 35,
                    difficulty: "medium",
                    nutrition: { protein: 42, carbs: 25, fat: 28, fiber: 8 },
                    tags: ["high-protein", "one-pan", "lean"],
                    ingredients: [
                        { name: "Chicken breast", amount: "6 oz" },
                        { name: "Mixed herbs", amount: "2 tbsp" },
                        { name: "Brussels sprouts", amount: "1 cup halved" }
                    ],
                    instructions: [
                        "Coat chicken with herbs and oil",
                        "Toss vegetables with oil and garlic",
                        "Roast vegetables at 425°F for 20 minutes",
                        "Add chicken, cook 15 minutes more"
                    ]
                }
            ],
            snacks: [
                {
                    id: "snack_001",
                    name: "Apple with Almond Butter",
                    category: "snack",
                    calories: 190,
                    prep_time: 2,
                    difficulty: "easy",
                    nutrition: { protein: 6, carbs: 25, fat: 8, fiber: 6 },
                    tags: ["quick", "portable", "natural-sugars"],
                    ingredients: [
                        { name: "Apple", amount: "1 medium" },
                        { name: "Almond butter", amount: "1 tbsp" }
                    ],
                    instructions: [
                        "Wash and slice apple",
                        "Serve with almond butter for dipping"
                    ]
                }
            ]
        };
    }
    async getMealRecommendations(params) {
        try {
            const mealsDatabase = await this.loadMealsDatabase();
            // Filter meals based on parameters
            let availableMeals = [];
            if (params.meal_type) {
                availableMeals = mealsDatabase[params.meal_type] || [];
            }
            else {
                // Include all meal types
                availableMeals = [
                    ...(mealsDatabase.breakfast || []),
                    ...(mealsDatabase.lunch || []),
                    ...(mealsDatabase.dinner || []),
                    ...(mealsDatabase.snacks || [])
                ];
            }
            // Apply filters
            if (params.max_prep_time) {
                availableMeals = availableMeals.filter(meal => meal.prep_time <= params.max_prep_time);
            }
            if (params.calorie_range) {
                const calorieRanges = {
                    low: { min: 0, max: 300 },
                    medium: { min: 300, max: 500 },
                    high: { min: 500, max: 1000 }
                };
                const range = calorieRanges[params.calorie_range];
                availableMeals = availableMeals.filter(meal => meal.calories >= range.min && meal.calories <= range.max);
            }
            if (params.dietary_restrictions && params.dietary_restrictions.length > 0) {
                availableMeals = availableMeals.filter(meal => params.dietary_restrictions.every(restriction => meal.tags.some(tag => tag.toLowerCase().includes(restriction.toLowerCase()) ||
                    this.matchesDietaryRestriction(meal, restriction))));
            }
            // Use AI to provide intelligent recommendations
            const aiRecommendation = await this.getAIRecommendation(availableMeals, params);
            // Get top 3-5 recommendations
            const topMeals = availableMeals.slice(0, Math.min(5, availableMeals.length));
            return {
                success: true,
                data: {
                    recommendations: topMeals,
                    totalAvailable: availableMeals.length,
                    filters: params,
                    aiInsight: aiRecommendation,
                    recommendationContext: this.generateRecommendationContext(params)
                },
                timestamp: new Date()
            };
        }
        catch (error) {
            console.error('Get meal recommendations tool error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get meal recommendations',
                timestamp: new Date()
            };
        }
    }
    matchesDietaryRestriction(meal, restriction) {
        const restrictionLower = restriction.toLowerCase();
        // Simple matching logic - could be enhanced
        switch (restrictionLower) {
            case 'vegetarian':
                return meal.tags.includes('vegetarian') || meal.tags.includes('vegan');
            case 'vegan':
                return meal.tags.includes('vegan');
            case 'low-carb':
            case 'keto':
                return meal.nutrition.carbs < 30 || meal.tags.includes('low-carb') || meal.tags.includes('keto-friendly');
            case 'high-protein':
                return meal.nutrition.protein >= 20 || meal.tags.includes('high-protein');
            case 'gluten-free':
                return meal.tags.includes('gluten-free');
            default:
                return false;
        }
    }
    async getAIRecommendation(meals, params) {
        try {
            const mealSummary = meals.slice(0, 3).map(meal => `${meal.name} (${meal.calories} cal, ${meal.prep_time}min, ${meal.difficulty})`).join(', ');
            const prompt = `
        As a nutrition expert, provide a brief recommendation for these meal options:
        ${mealSummary}
        
        User preferences:
        - Meal type: ${params.meal_type || 'any'}
        - Max prep time: ${params.max_prep_time || 'no limit'} minutes
        - Dietary restrictions: ${params.dietary_restrictions?.join(', ') || 'none'}
        - Calorie preference: ${params.calorie_range || 'any'}
        - Activity level: ${params.activity_level || 'not specified'}
        
        Provide a 2-3 sentence recommendation focusing on why these meals are good choices for the user.
      `;
            return await this.openAIService.generateText(prompt);
        }
        catch (error) {
            console.warn('Failed to get AI recommendation:', error);
            return 'Based on your preferences, these meals provide a good balance of nutrition, preparation time, and taste.';
        }
    }
    generateRecommendationContext(params) {
        const contextParts = [];
        if (params.meal_type) {
            contextParts.push(`Showing ${params.meal_type} options`);
        }
        if (params.max_prep_time) {
            contextParts.push(`under ${params.max_prep_time} minutes prep time`);
        }
        if (params.calorie_range) {
            contextParts.push(`${params.calorie_range} calorie range`);
        }
        if (params.dietary_restrictions && params.dietary_restrictions.length > 0) {
            contextParts.push(`following ${params.dietary_restrictions.join(', ')} diet`);
        }
        return contextParts.length > 0
            ? `Filtered for: ${contextParts.join(', ')}`
            : 'Showing all available meal options';
    }
}
exports.MealTools = MealTools;
//# sourceMappingURL=MealTools.js.map