import { SEO } from './SEO';
import { Link } from 'react-router-dom';

export function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto mt-12 animate-fade-in p-8">
            <SEO title="Privacy Policy" description="Read our privacy policy to understand how we protect your data." url="/privacy" />
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-8 border-b border-slate-200 pb-4">Privacy Policy</h1>

                <div className="space-y-6 text-slate-800 leading-relaxed text-lg">
                    <p>
                        We are committed to protecting your privacy. We want to be transparent about how we handle your data:
                    </p>
                    <ul className="list-disc pl-5 space-y-3">
                        <li>
                            <strong>No Personal Data Collection:</strong> We do not collect any personal data from users of the LGBTQ+ & Drag Bingo Directory app.
                        </li>
                        <li>
                            <strong>Standard Logging:</strong> Like most websites, our server logs standard technical information such as IP addresses and browser types for security and maintenance purposes.
                        </li>
                        <li>
                            <strong>No Data Selling or Sharing:</strong> We do not sell, trade, or share any user data with third parties.
                        </li>
                        <li>
                            <strong>Legal Compliance:</strong> We will comply with valid requests from government agencies or court orders if required by law.
                        </li>
                    </ul>

                    <div className="mt-8 border-t border-slate-200 pt-6 bg-slate-50 p-6 rounded-xl">
                        <h3 className="text-2xl font-bold mb-4 text-slate-900">Third-Party Services</h3>
                        <p className="mb-4">
                            We use <strong>Formspree.io</strong> to process our "Contact Us" form submissions. When you submit a form, your data (including your email address) is forwarded by Formspree to our Google (Gmail) account.
                        </p>
                        <p className="mb-4">
                            Please note that as third-party vendors, Formspree and Google operate independently and are outside of our direct control. Both services maintain their own privacy policies:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li>
                                <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-medium">Formspree Privacy Policy</a>
                            </li>
                            <li>
                                <a href="https://policies.google.com/privacy?hl=en" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-medium">Google Privacy Policy</a>
                            </li>
                        </ul>
                        <p className="text-sm text-slate-600 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                            <strong>Disclaimer:</strong> By using the contact services on this site, you acknowledge and agree to the privacy terms of these third-party providers. If you do not agree with our privacy statement or the terms of these vendors, please do not use the contact form.
                        </p>
                    </div>

                    <p className="border-t border-slate-200 pt-6 mt-6 text-base text-slate-600 italic">
                        If you have any questions about this policy, please contact the site administrator.
                    </p>
                </div>

                <div className="mt-12 flex justify-center">
                    <Link
                        to="/"
                        className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl shadow-md hover:bg-teal-700 transition-colors text-lg"
                    >
                        Return to Home Page
                    </Link>
                </div>
            </div>
        </div>
    );
}
