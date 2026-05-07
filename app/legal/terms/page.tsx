import Link from 'next/link';

export default function TermsAndConditions() {
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
        <h1 className="display-sm mb-10">TERMS AND CONDITIONS</h1>
        <div className="flex flex-col gap-6 body-md text-[#555]">
          <p>
            Welcome to the digital curation of DILIO. By accessing this website, you agree to comply with and be bound by the following terms and conditions.
          </p>
          <h2 className="label-md text-primary mt-4">1. Intellectual Property</h2>
          <p>
            All content, including the monolithic design system, audio tracks, visual assets, 3D artifacts, and associated code structures are the intellectual property of DILIO. Unauthorized reproduction or redistribution is strictly prohibited.
          </p>
          <h2 className="label-md text-primary mt-4">2. Website Use</h2>
          <p>
            The website is provided "as is". We reserve the right to restrict access to automated requests, bots, or unauthorized scraping in order to protect the integrity of the platform.
          </p>
          <h2 className="label-md text-primary mt-4">3. Sales and Commerce</h2>
          <p>
            Any artifact or physical merchandise listed on this site is subject to availability. Prices and availability may shift without prior notice.
          </p>
        </div>
      </div>
    </main>
  );
}
