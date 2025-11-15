'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChartIcon } from '@/components/icons/ChartIcon';
import { Loader2Icon } from '@/components/icons/Loader2Icon';
import { TwitterIcon } from '@/components/icons/TwitterIcon';
import { DiscordIcon } from '@/components/icons/DiscordIcon';
import { useStore } from '@/store';
import { useRouter } from 'next/navigation';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isLoginView && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess();
    }, 1000);
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden bg-gray-900 lg:flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <ChartIcon className="w-14 h-14 text-cyan-400" />
            <h1 className="text-5xl font-bold text-white tracking-wider">
              Signal <span className="text-cyan-400">Gen</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-md mx-auto">
            Harness the power of AI to generate, analyze, and execute trading signals with unparalleled precision.
          </p>
        </div>
        <div className="absolute bottom-4 left-4 text-xs text-gray-500">
          © 2025 Signal Gen. All Rights Reserved.
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Card className="bg-gray-900/80 border-gray-700">
            <CardHeader>
              <CardTitle className="text-3xl">{isLoginView ? 'Welcome Back' : 'Create an Account'}</CardTitle>
              <CardDescription>
                {isLoginView ? 'Sign in to access your dashboard.' : 'Join the community of AI-powered traders.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    disabled={isLoading}
                    required
                    className="bg-gray-800 border-gray-600 focus:ring-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    required
                    className="bg-gray-800 border-gray-600 focus:ring-cyan-500"
                  />
                </div>
                {!isLoginView && (
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isLoading}
                      required
                      className="bg-gray-800 border-gray-600 focus:ring-cyan-500"
                    />
                  </div>
                )}
                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      {isLoginView ? 'Signing In...' : 'Creating Account...'}
                    </>
                  ) : (
                    isLoginView ? 'Sign In' : 'Sign Up'
                  )}
                </Button>
              </form>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="bg-gray-800 border-gray-600 hover:bg-gray-700">
                  <TwitterIcon className="mr-2 h-4 w-4" />
                  Twitter
                </Button>
                <Button variant="outline" className="bg-gray-800 border-gray-600 hover:bg-gray-700">
                  <DiscordIcon className="mr-2 h-4 w-4" />
                  Discord
                </Button>
              </div>
              <div className="mt-6 text-center text-sm">
                <button onClick={toggleView} className="text-cyan-400 hover:underline">
                  {isLoginView ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}