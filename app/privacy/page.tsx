import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Waifu Gallery",
  description: "Privacy policy and data collection practices for Waifu Gallery.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
      
      <div className="space-y-8 text-foreground/80 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Introduction</h2>
          <p>
            Welcome to Waifu Gallery. We respect your privacy and are committed to protecting 
            your personal data. This privacy policy will inform you as to how we look after 
            your personal data when you visit our website and tell you about your privacy 
            rights and how the law protects you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Data We Collect</h2>
          <p className="mb-2">We collect distinct types of data to improve your experience:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Local Storage:</strong> We store your "Favorites" list, "Dark Mode" preference, 
              and "NSFW Consent" status locally on your device. This data is not sent to our servers.
            </li>
            <li>
              <strong>Usage Data:</strong> We may use analytics tools to monitor traffic patterns, 
              search queries, and page views to improve performance.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Third-Party Services</h2>
          <p className="mb-4">
            Our application integrates with third-party services. We do not control these 
            third parties' tracking technologies:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Waifu.pics API:</strong> Images are fetched from the waifu.pics API. 
              Requests to their servers may be subject to their own privacy policies.
            </li>
            <li>
              <strong>Advertising Partners:</strong> We may use third-party advertising companies 
              to serve ads when you visit our website. These companies may use cookies to provide 
              advertisements about goods and services of interest to you.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track the activity on our 
            service and store certain information. You can instruct your browser to refuse 
            all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Children's Privacy</h2>
          <p>
            Our Service does not address anyone under the age of 13. Furthermore, our "NSFW" 
            section is strictly restricted to users aged 18 and older. We do not knowingly 
            collect personally identifiable information from anyone under the age of 18.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, you can contact us at: 
            <a href="mailto:contact@yourdomain.com" className="text-primary hover:underline ml-1">
              contact@yourdomain.com
            </a>
          </p>
        </section>
        
        <p className="text-sm text-muted-foreground mt-8">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}