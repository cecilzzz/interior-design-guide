import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-playfair text-center mb-12">Privacy Policy & Cookie Statement</h1>
      
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-playfair mb-4">1. Data Collection</h2>
          <p>We use Google Analytics to collect and analyze website traffic. The information we collect includes:</p>
          <ul>
            <li>Page visit information and browsing patterns</li>
            <li>Time spent on pages</li>
            <li>Device information (type, browser, operating system)</li>
            <li>Geographic location (country/region level only)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-playfair mb-4">2. Cookie Usage</h2>
          <p>Our website uses cookies for:</p>
          <ul>
            <li>Analytics purposes (Google Analytics)
              <ul>
                <li>Duration: 2 years</li>
                <li>Purpose: Traffic analysis</li>
              </ul>
            </li>
            <li>Technical cookies
              <ul>
                <li>Duration: Session</li>
                <li>Purpose: Website functionality</li>
              </ul>
            </li>
          </ul>
          <p>You can control cookie settings through your browser preferences.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-playfair mb-4">3. Purpose of Data Usage</h2>
          <p>We use the collected data to:</p>
          <ul>
            <li>Understand website traffic patterns</li>
            <li>Improve content quality</li>
            <li>Optimize user experience</li>
            <li>Analyze website performance</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-playfair mb-4">4. Third-Party Services</h2>
          <p>We utilize:</p>
          <ul>
            <li>Google Analytics for website analytics</li>
            <li>Google AdSense for advertising (planned)</li>
          </ul>
          <p>These services may collect and process your data according to their own privacy policies.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-playfair mb-4">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Opt-out of Google Analytics tracking</li>
            <li>Control cookies through browser settings</li>
            <li>Request information about your data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-playfair mb-4">6. Data Storage and Security</h2>
          <ul>
            <li>Data is processed and stored by Google Analytics</li>
            <li>We implement standard security measures</li>
            <li>Data retention period: 26 months (Google Analytics default)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-playfair mb-4">7. Changes to This Policy</h2>
          <p>We may update this policy periodically. Changes will be posted on this page with an updated revision date.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-playfair mb-4">8. Contact</h2>
          <p>For privacy-related inquiries, please use our website contact form.</p>
        </section>

        <div className="mt-12 text-sm text-gray-500">
          <p>Last updated: March 2024</p>
        </div>
      </div>
    </div>
  );
} 