'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Sparkles, BookOpen, Clock, ArrowRight } from 'lucide-react';
export function TutorProfileEmptyState() {

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4 py-8">
        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <GraduationCap className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-brand-dark">Become a Tutor</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Share your knowledge, set your own schedule, and earn money by teaching students worldwide. 
          Create your professional profile today to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/60 shadow-sm rounded-3xl bg-muted/5">
          <CardHeader className="pb-4">
            <Sparkles className="h-8 w-8 text-amber-500 mb-2" />
            <CardTitle className="text-lg">Build Your Brand</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              Showcase your expertise, experience, and unique teaching style to attract students.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm rounded-3xl bg-muted/5">
          <CardHeader className="pb-4">
            <Clock className="h-8 w-8 text-emerald-500 mb-2" />
            <CardTitle className="text-lg">Flexible Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              Teach whenever you want. You have full control over your availability and working hours.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm rounded-3xl bg-muted/5">
          <CardHeader className="pb-4">
            <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
            <CardTitle className="text-lg">Teach Your Way</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              Focus on the subjects you love. Connect with students who match your teaching style.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-8">
        <Button 
          size="lg" 
          className="font-black px-12 shadow-xl shadow-primary/30 h-14 text-lg rounded-2xl gap-2 transition-transform hover:scale-[1.02]"
          asChild
        >
          <a href="/onboarding/tutor">Complete Onboarding <ArrowRight className="h-5 w-5" /></a>
        </Button>
      </div>
    </div>
  );
}
