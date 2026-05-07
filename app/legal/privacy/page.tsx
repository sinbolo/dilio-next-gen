import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-surface-container-lowest pt-40 pb-20 px-10">
      <div className="max-w-[800px] mx-auto">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 label-md text-primary hover:text-primary/70 transition-colors mb-12 group"
        >
          <span className="text-xl transition-transform group-hover:-translate-x-1">←</span>
          VOLVER
        </Link>
        <h1 className="display-sm mb-10">PRIVACY POLICY</h1>
        <div className="flex flex-col gap-6 body-md text-[#555]">
          <p>
            Effective Date: 01.01.2024
          </p>
          <p>
            DILIO values your privacy and is committed to protecting your personal data in compliance with the General Data Protection Regulation (GDPR). This Privacy Policy explains how we collect, use, and protect your information when you visit our website.
          </p>
          <h2 className="label-md text-primary mt-4">1. Data We Collect</h2>
          <p>
            We only collect strictly necessary information through our secure contact forms, which may include your email address and message contents. We also use strictly necessary cookies to run this website.
          </p>
          <h2 className="label-md text-primary mt-4">2. Use of Data</h2>
          <p>
            The data collected is solely used for processing your inquiries or ensuring the security of our platform. We do not sell or rent your personal data to third parties. Our servers employ enterprise-grade security and rate limiting to protect your information.
          </p>
          <h2 className="label-md text-primary mt-4">3. Your Rights</h2>
          <p>
            You have the right to access, rectify, or erase your personal data at any time. If you wish to exercise these rights, please secure an inquiry through our Contact Form.
          </p>
        </div>
      </div>
    </main>
  );
}
