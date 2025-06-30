import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">About Us</h1>
      <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            At Event Planner, our mission is to simplify event management for everyone. We believe that planning an event, whether it's a small gathering or a large-scale conference, should be an exciting and stress-free experience. Our platform is designed to empower individuals and organizations to create, manage, and execute successful events with ease.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed">
            We are a passionate team of developers, designers, and event enthusiasts dedicated to building innovative solutions for the event industry. With years of experience in technology and event planning, we understand the challenges faced by organizers and strive to provide tools that address these pain points effectively.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">What We Offer</h2>
          <p className="text-gray-600 leading-relaxed">
            Event Planner offers a comprehensive suite of features to streamline every aspect of your event:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed ml-4">
            <li><strong>Intuitive Event Creation:</strong> Easily set up your event details, dates, and locations.</li>
            <li><strong>Task Management:</strong> Keep track of all your to-dos with our robust task management system.</li>
            <li><strong>AI-Powered Suggestions:</strong> Get smart recommendations for vendors and services tailored to your event needs.</li>
            <li><strong>Guest Management:</strong> Manage your guest lists, RSVPs, and communications effortlessly.</li>
            <li><strong>Budget Tracking:</strong> Stay on top of your finances with integrated budget tools.</li>
            <li><strong>Collaboration Tools:</strong> Work seamlessly with your team and co-organizers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            Our vision is to become the leading event management platform, recognized for its user-friendliness, powerful features, and commitment to customer success. We continuously strive to innovate and incorporate the latest technologies to provide an unparalleled event planning experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Join Our Community</h2>
          <p className="text-gray-600 leading-relaxed">
            We invite you to explore Event Planner and discover how we can help make your next event a resounding success. Join our growing community of happy event organizers and experience the future of event management.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed ml-4">
            <li>Email: info@eventplanner.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Event Lane, Suite 100, City, Country</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
