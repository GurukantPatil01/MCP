'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Activity, 
  Brain, 
  Heart, 
  Moon, 
  Zap, 
  Shield, 
  Smartphone,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  onSignIn: () => void;
  onSignUp: () => void;
  onDemoAccess?: () => void;
}

export function LandingPage({ onSignIn, onSignUp, onDemoAccess }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo('.hero-title', 
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );
      
      gsap.fromTo('.hero-subtitle', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' }
      );
      
      gsap.fromTo('.hero-buttons', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo('.hero-graphic', 
        { opacity: 0, scale: 0.8, rotation: -5 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.5, delay: 0.4, ease: 'back.out(1.7)' }
      );

      // Features animation with ScrollTrigger
      gsap.utils.toArray('.feature-card').forEach((card: any, index) => {
        gsap.fromTo(card,
          { opacity: 0, y: 60, rotation: -2 },
          {
            opacity: 1,
            y: 0,
            rotation: 0,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // About section parallax
      gsap.to('.about-background', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Stats counter animation
      gsap.utils.toArray('.stat-number').forEach((stat: any) => {
        const target = parseInt(stat.dataset.target);
        gsap.fromTo(stat, 
          { textContent: 0 },
          {
            textContent: target,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: stat,
              start: 'top 80%',
            }
          }
        );
      });

      // CTA section animation
      gsap.fromTo('.cta-content',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 70%',
          }
        }
      );

      // Floating animations
      gsap.to('.float-element', {
        y: -20,
        duration: 2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.3
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <Activity className="h-8 w-8" />,
      title: 'Real-time Health Tracking',
      description: 'Monitor steps, calories, heart rate, and sleep patterns with live updates from Google Health.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'AI-Powered Insights',
      description: 'Get personalized health recommendations powered by OpenAI GPT-4 technology.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Lightning Fast',
      description: 'Dashboard loads in under 2 seconds with optimized performance and smooth animations.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Privacy First',
      description: 'No data storage. Your health information flows securely without being saved.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: 'Mobile Optimized',
      description: 'Beautiful, responsive design that works perfectly on all your devices.',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Holistic Health View',
      description: 'Get a complete picture of your wellness with integrated metrics and trends.',
      gradient: 'from-red-500 to-pink-500'
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen overflow-hidden">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
        <div className="container mx-auto px-4 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="hero-title text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                Your Health,
                <br />
                <span className="text-4xl lg:text-6xl">Intelligently Tracked</span>
              </h1>
              <p className="hero-subtitle text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mt-6 leading-relaxed transition-colors">
                A minimalist dashboard that transforms your Google Health data into 
                <span className="font-semibold text-indigo-600 dark:text-indigo-400"> AI-powered insights</span> for better wellness decisions.
              </p>
              <div className="hero-buttons flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                <Button 
                  onClick={onSignUp}
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  onClick={onSignIn}
                  variant="outline" 
                  size="lg"
                  className="px-8 py-4 text-lg border-2 hover:bg-indigo-50 transition-all duration-300"
                >
                  Sign In
                </Button>
                {onDemoAccess && (
                  <Button 
                    onClick={onDemoAccess}
                    variant="secondary" 
                    size="sm"
                    className="px-4 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
                  >
                    🚀 Demo Access
                  </Button>
                )}
              </div>
            </div>
            
            <div className="hero-graphic relative">
              <div className="relative w-full max-w-lg mx-auto">
                {/* Floating elements */}
                <div className="absolute -top-8 -right-8 float-element">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-lg">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 float-element">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-2xl shadow-lg">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute top-1/2 -right-12 float-element">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                {/* Main dashboard mockup */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-500">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="h-3 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded-full transition-colors"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 space-y-2 transition-colors">
                          <div className="h-2 w-12 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors"></div>
                          <div className="h-6 w-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg"></div>
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-300 dark:to-purple-300 rounded-full mx-auto"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-white dark:bg-gray-900 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Crisp Health</span>?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              Experience the future of health tracking with cutting-edge AI and beautiful, intuitive design.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card group hover:shadow-xl dark:hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About/Stats Section */}
      <section ref={aboutRef} className="about-section relative py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white overflow-hidden">
        <div className="about-background absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Trusted by Health Enthusiasts
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands who've transformed their health journey with AI-powered insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                <span className="stat-number" data-target="10000">0</span>+
              </div>
              <p className="text-blue-100 text-lg">Active Users</p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                <span className="stat-number" data-target="99">0</span>%
              </div>
              <p className="text-blue-100 text-lg">Uptime Guarantee</p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                <span className="stat-number" data-target="2">0</span>s
              </div>
              <p className="text-blue-100 text-lg">Load Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="cta-section py-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-500">
        <div className="container mx-auto px-4 text-center">
          <div className="cta-content max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Ready to Transform Your Health Journey?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed transition-colors">
              Get started in 60 seconds. Connect your Google Health account and experience 
              the power of AI-driven health insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 transition-colors">
                <CheckCircle className="h-5 w-5" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 transition-colors">
                <CheckCircle className="h-5 w-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 transition-colors">
                <CheckCircle className="h-5 w-5" />
                <span>Privacy guaranteed</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onSignUp}
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg border-2 hover:bg-indigo-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold">Crisp Health</span>
          </div>
          <p className="text-gray-400">
            Built with ❤️ for better health tracking
          </p>
        </div>
      </footer>
    </div>
  );
}
