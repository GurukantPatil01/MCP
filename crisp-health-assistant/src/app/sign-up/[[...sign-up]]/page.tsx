'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl">
              <svg 
                className="h-8 w-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" 
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Join Crisp Health!</h1>
          <p className="text-gray-600 mt-2">
            Start your AI-powered health journey today
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-8">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg",
                card: "shadow-none bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: 
                  "border-2 hover:bg-gray-50 transition-all duration-300",
                formFieldInput: 
                  "border-2 focus:border-indigo-500 transition-colors",
                footerActionLink: 
                  "text-indigo-600 hover:text-indigo-700"
              }
            }}
            redirectUrl="/dashboard"
          />
        </div>
        
        <div className="text-center mt-6">
          <p className="text-gray-500">
            Built with ❤️ for better health tracking
          </p>
        </div>
      </div>
    </div>
  );
}
