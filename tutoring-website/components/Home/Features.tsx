// src/components/Home/Features.tsx
'use client';

import Badge from '@/components/Common/Badge';

interface Feature {
  icon: string;
  title: string;
  description: string;
  details: string[];
}

export default function Features() {
  const features: Feature[] = [
    {
      icon: '👨‍🏫',
      title: 'Expert Tutors',
      description: 'Learn from experienced educators with proven track records',
      details: [
        'Verified credentials and experience',
        'Specialized in various subjects',
        'Passionate about student success',
      ],
    },
    {
      icon: '📅',
      title: 'Flexible Scheduling',
      description: 'Book sessions that fit your busy schedule perfectly',
      details: [
        'Choose your preferred time slots',
        'Reschedule anytime, hassle-free',
        'Early morning to late evening options',
      ],
    },
    {
      icon: '🎯',
      title: 'Personalized Learning',
      description: 'Customized lessons tailored to your unique learning style',
      details: [
        'One-on-one attention',
        'Tailored lesson plans',
        'Progress tracking and feedback',
      ],
    },
    {
      icon: '💰',
      title: 'Affordable Pricing',
      description: 'Quality education at prices that fit your budget',
      details: [
        'Transparent pricing',
        'No hidden fees',
        'Flexible payment options',
      ],
    },
    {
      icon: '🏆',
      title: 'Proven Results',
      description: 'Join thousands of students who improved their grades',
      details: [
        'Average grade improvement: +2.5',
        'Student satisfaction: 98%',
        'High success rate on exams',
      ],
    },
    {
      icon: '🔒',
      title: 'Safe & Secure',
      description: 'Your privacy and security are our top priorities',
      details: [
        'Encrypted communication',
        'Verified tutor profiles',
        'Secure payment processing',
      ],
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="info" icon="✨">
            Why Choose Us
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-4 mb-4">
            Everything You Need to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Succeed Academically
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our comprehensive tutoring platform provides all the tools and support
            you need to achieve your academic goals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl hover:border-green-200 transition duration-300"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 group-hover:scale-110 transition duration-300">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>

              {/* Details List */}
              <ul className="space-y-2">
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              {/* Hover effect underline */}
              <div className="mt-6 h-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-full w-0 group-hover:w-full transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <p className="text-lg text-gray-600 mb-6">
            Ready to transform your academic journey?
          </p>
          <a
            href="/register"
            className="inline-block bg-green-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-green-700 transition duration-200 shadow-lg hover:shadow-xl"
          >
            Start Your Free Trial
          </a>
        </div>
      </div>
    </section>
  );
}