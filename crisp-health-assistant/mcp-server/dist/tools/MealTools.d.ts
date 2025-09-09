import { OpenAIService } from '../services/OpenAIService';
import { MCPToolResult } from '../types/health';
interface MealRecommendationParams {
    meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    max_prep_time?: number;
    dietary_restrictions?: string[];
    calorie_range?: 'low' | 'medium' | 'high';
    activity_level?: string;
}
export declare class MealTools {
    private openAIService;
    private mealsDatabase;
    constructor(openAIService: OpenAIService);
    private loadMealsDatabase;
    private getFallbackMealsDatabase;
    getMealRecommendations(params: MealRecommendationParams): Promise<MCPToolResult>;
    private matchesDietaryRestriction;
    private getAIRecommendation;
    private generateRecommendationContext;
}
export {};
//# sourceMappingURL=MealTools.d.ts.map