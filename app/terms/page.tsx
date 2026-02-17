import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Waifu Gallery",
  description:
    "Terms and conditions for using Waifu Gallery. Read our service terms before using the site.",
  alternates: {
    canonical: "https://waifugallery.netlify.app/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <div className="space-y-6 text-foreground/80">
        <p>
          <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
        </p>

        <h3 className="text-xl font-bold mt-6 text-foreground">
          1. Acceptance of Terms
        </h3>
        <p>
          By accessing Waifu Gallery, you agree to be bound by these Terms of
          Service. If you disagree with any part of the terms, you may not
          access the service.
        </p>

        <h3 className="text-xl font-bold mt-6 text-foreground">
          2. Age Restriction (NSFW Content)
        </h3>
        <p>
          You must be at least 18 years of age to access the "NSFW" (Not Safe
          For Work) sections of this website. By enabling NSFW content, you
          certify that you are 18 years of age or older and that accessing such
          content is legal in your jurisdiction.
        </p>

        <h3 className="text-xl font-bold mt-6 text-foreground">
          3. Content Disclaimer
        </h3>
        <p>
          Waifu Gallery acts as a search engine and gallery interface. Images
          displayed are fetched from third-party sources (Waifu.pics). We do not
          host, own, or claim ownership of the images displayed.
        </p>

        <h3 className="text-xl font-bold mt-6 text-foreground">
          4. User Conduct
        </h3>
        <p>
          You agree not to misuse the service, including but not limited to
          excessive automated requests (scraping) that burden the third-party
          API or attempting to bypass the age verification mechanisms.
        </p>

        <h3 className="text-xl font-bold mt-6 text-foreground">
          5. Limitation of Liability
        </h3>
        <p>
          In no event shall Waifu Gallery be liable for any indirect,
          incidental, special, consequential or punitive damages, including
          without limitation, loss of profits, data, use, goodwill, or other
          intangible losses.
        </p>
      </div>
    </div>
  );
}
