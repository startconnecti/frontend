export function FinalCTA() {
  return (
    <section className="bg-[#F5F0E8] py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* label */}
        <p className="text-base tracking-widest text-[#E8341A] font-bold mb-6">
          GET STARTED
        </p>

        {/* heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#2C1208] mb-4">
          Find your mentor{" "}
          <span className="text-[#E8341A]">today</span>
        </h2>

        {/* subtitle */}
        <p className="text-lg text-[#6B5B53] mb-10 max-w-2xl mx-auto">
          Your next chapter starts with one conversation. Book in minutes.
        </p>

        {/* buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3.5 rounded-full border border-[#2C1208] text-[#2C1208] font-semibold hover:bg-[#2C1208]/5 transition-all">
            Browse Mentors →
          </button>

          <button className="px-8 py-3.5 rounded-full border border-[#2C1208] text-[#2C1208] font-semibold hover:bg-[#2C1208]/5 transition-all">
            See How It Works
          </button>
        </div>
      </div>
    </section>
  );
}