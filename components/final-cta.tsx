export function FinalCTA() {
  return (
    <section className="bg-brand-light py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* label */}
        <p className="text-base tracking-widest text-brand-orange font-bold mb-6">
          GET STARTED
        </p>

        {/* heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-4">
          Find your mentor{" "}
          <span className="text-brand-orange">today</span>
        </h2>

        {/* subtitle */}
        <p className="text-lg text-brand-muted mb-10 max-w-2xl mx-auto">
          Your next chapter starts with one conversation. Book in minutes.
        </p>

        {/* buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3.5 rounded-full border border-brand-dark text-brand-dark font-semibold hover:bg-brand-dark/5 transition-all">
            Browse Mentors →
          </button>

          <button className="px-8 py-3.5 rounded-full border border-brand-dark text-brand-dark font-semibold hover:bg-brand-dark/5 transition-all">
            See How It Works
          </button>
        </div>
      </div>
    </section>
  );
}