export function FinalCTA() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are achieving their goals with the right mentor. Start your journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-semibold text-lg">
              Get Started Free
            </button>
            <button className="px-8 py-3.5 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-all font-semibold text-lg">
              Learn More
            </button>
          </div>

          <p className="text-sm text-muted-foreground">
            No credit card required • First session is free
          </p>
        </div>
      </div>
    </section>
  );
}
