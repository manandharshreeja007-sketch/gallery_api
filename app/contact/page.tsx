import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Waifu Gallery",
  description: "Get in touch with the Waifu Gallery team.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      
      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <p className="text-lg text-center mb-8 text-foreground/80">
          Have a suggestion, found a bug, or just want to say hello? 
          We'd love to hear from you.
        </p>

        <div className="space-y-6">
          <div className="flex flex-col items-center p-6 bg-secondary/20 rounded-lg">
            <h3 className="font-semibold text-xl mb-2">General Inquiries</h3>
            <p className="text-muted-foreground mb-4">For general questions and feedback</p>
            <a 
              href="mailto:gooam001@gmail.com" 
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
            >
              gooam001@gmail.com
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}