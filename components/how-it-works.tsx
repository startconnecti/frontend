import { Search, MessageCircle, TrendingUp } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      number: '1',
      title: 'Search & Discover',
      description: 'Browse thousands of verified mentors across industries and expertise areas.',
    },
    {
      icon: MessageCircle,
      number: '2',
      title: 'Connect & Chat',
      description: "Send a message to mentors you're interested in and schedule your first session.",
    },
    {
      icon: TrendingUp,
      number: '3',
      title: 'Learn & Grow',
      description: 'Get personalized guidance, strategic advice, and accelerate your professional journey.',
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connecting with your perfect mentor is simple. Get started in three easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(step => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.number}. {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 p-8 rounded-lg bg-secondary/5 border border-secondary/20">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Why Choose Connecti?
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Verified mentors with proven track records</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Flexible scheduling to fit your calendar</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Secure messaging and video calls</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Personalized mentor matching</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
