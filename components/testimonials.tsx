import { Star } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      text: "Working with my mentor has been transformative. In just 6 months, I went from struggling with leadership to successfully managing a team of 8.",
      author: 'Alex Turner',
      role: 'Product Manager at Startup',
      rating: 5,
    },
    {
      text: "I found exactly the right mentor for my fundraising journey. Their insights helped me close a Series A round in 4 months.",
      author: 'Priya Sharma',
      role: 'Founder & CEO',
      rating: 5,
    },
    {
      text: "The quality of mentors on Connecti is exceptional. I learned more in 3 months than I did in a year of online courses.",
      author: 'David Kim',
      role: 'Engineer at Tech Company',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-secondary text-card">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Trusted by Professionals Worldwide
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Real success stories from people who've transformed their careers with Connecti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-secondary/80 backdrop-blur-sm rounded-lg p-8 border border-card/20">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm opacity-75">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
