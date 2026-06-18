import { SEO } from './SEO';
import { Link } from 'react-router-dom';

export function ResourcesPage() {
    return (
        <div className="max-w-4xl mx-auto mt-12 animate-fade-in p-8">
            <SEO
                title="Helpful Resources for Living Well After 65"
                description="A short list of trusted resources to help older adults stay safe, plan ahead, and make daily life easier."
                url="/resources"
            />

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
                    Helpful Resources for Living Well After 65
                </h1>

                <div className="space-y-8 text-slate-800 leading-relaxed text-lg">
                    <p className="text-slate-600">
                        This page includes a small number of resources chosen to address common challenges many older adults and caregivers face. I keep this list short on purpose.
                    </p>

                    {/* Disclosure Box */}
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-base text-slate-700">
                        <strong>Disclosure:</strong> By clicking on product links on this page, we may receive a percentage of the sale, as a commission payment of sale.
                    </div>

                    {/* RESOURCE 1 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Safety at Home</h2>
                        <p className="mb-4">
                            Falls and medical emergencies are a serious concern for people living alone. Medical alert systems are designed to help you get assistance quickly when it matters most.
                        </p>
                        <p className="mb-6">
                            <strong>Medical alert systems with fall detection</strong><br />
                            Simple, senior-focused devices with 24/7 emergency response.
                        </p>
                        <a className="inline-block px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-400 font-semibold cursor-default pointer-events-none select-none" href="#">
                            Medical Alert Resources (link coming soon)
                        </a>
                    </div>

                    {/* RESOURCE 2 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Insurance & Planning</h2>
                        <p className="mb-4">
                            Planning ahead can ease stress for both you and your family. Understanding insurance options doesn’t have to be complicated.
                        </p>
                        <p className="mb-6">
                            <strong>Insurance comparison tools</strong><br />
                            A straightforward way to review coverage options without calling multiple companies.
                        </p>
                        <a className="inline-block px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-400 font-semibold cursor-default pointer-events-none select-none" href="#">
                            Insurance Planning Resources (link coming soon)
                        </a>
                    </div>

                    {/* RESOURCE 3 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Making Daily Life Easier</h2>
                        <p className="mb-4">
                            Everyday tasks like dressing can become difficult due to arthritis, shoulder issues, or limited mobility. The right clothing can help maintain independence.
                        </p>
                        <p className="mb-6">
                            <strong>Adaptive clothing & easy-dressing essentials</strong><br />
                            Designed for comfort, mobility, and caregiver support.
                        </p>
                        <a className="inline-block px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-400 font-semibold cursor-default pointer-events-none select-none" href="#">
                            Adaptive Clothing Resources (link coming soon)
                        </a>
                    </div>

                    <div className="border-t border-slate-200 pt-8 mt-8">
                        <p className="text-sm text-slate-500 mb-2">
                            <strong>Note:</strong> This page is for general information only and does not replace professional medical, legal, or financial advice.
                        </p>
                        <p className="text-sm text-slate-500">
                            Questions or suggestions? Contact: <a href="mailto:YOUR_EMAIL_HERE" className="text-teal-600 hover:underline">YOUR_EMAIL_HERE</a>
                        </p>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Link
                            to="/"
                            className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl shadow-md hover:bg-teal-700 transition-colors text-lg"
                        >
                            Return to Home Page
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
