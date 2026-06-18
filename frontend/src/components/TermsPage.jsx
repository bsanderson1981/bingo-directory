import { SEO } from './SEO';
import { Link } from 'react-router-dom';

export function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto mt-12 animate-fade-in p-8">
            <SEO title="Terms of Use" description="Read our terms of use to understand the rules and guidelines for using the LGBTQ+ & Drag Bingo Directory." url="/terms" />
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-8 border-b border-slate-200 pb-4">Terms of Use</h1>

                <div className="space-y-6 text-slate-800 leading-relaxed text-lg">
                    <p>
                        <strong>Data Source:</strong> We gather event and venue data from public websites and community submissions.
                    </p>
                    <p>
                        <strong>No Warranty:</strong> We do not vet the information shown or warrant the validity of any event or venue listed on our website. All information you find is used at your own risk.
                    </p>
                    <p>
                        <strong>User Responsibility:</strong> We strongly suggest you do your own review of any event listing before interacting with the host venue in person or online.
                    </p>
                    <div className="p-6 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 font-medium shadow-sm">
                        <strong className="block mb-2 text-xl">Donation Warning:</strong>
                        We advise strongly that you should never donate any real property, cash, stocks, or currency of any value to the events or venues listed based solely on this website's information.
                        <br /><br />
                        If you choose to donate to charities listed on our website, please seek professional legal and/or professional charity donation assistance before transferring any property or cash value holdings.
                    </div>
                    <p>
                        <strong>Modifications:</strong> We reserve the right to update, modify, or remove any or all listings at any time without notice.
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
