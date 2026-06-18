import { useState } from 'react';
import { SEO } from './SEO';
import { Link } from 'react-router-dom';

export function FeedbackForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        comment: '',
        mathAnswer: '' // Captcha Answer
    });

    const [captcha, setCaptcha] = useState({
        a: Math.floor(Math.random() * 5) + 1, // 1-5
        b: Math.floor(Math.random() * 5) + 1  // 1-5
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Basic HTML sanitation to prevent code injection
    const sanitizeInput = (str) => {
        return str.replace(/[<>]/g, '');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Sanitize immediately on input to prevent pasting malicious code
        const safeValue = sanitizeInput(value);
        setFormData(prev => ({ ...prev, [name]: safeValue }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.comment.trim()) {
            newErrors.comment = "Comment is required";
        } else if (formData.comment.length > 500) {
            newErrors.comment = "Comment must be less than 500 characters";
        }

        // Captcha Validation
        const correctAnswer = captcha.a + captcha.b;
        if (parseInt(formData.mathAnswer) !== correctAnswer) {
            newErrors.mathAnswer = "Incorrect math answer. Please try again.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            // NOTE: This endpoint needs to be replaced with your actual Formspree endpoint
            // Example: 'https://formspree.io/f/xvbdk...'
            const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xzdrbjjz';

            // For development demo purposes, we'll simulate success if the endpoint is placeholder
            if (FORMSPREE_ENDPOINT.includes('PLACEHOLDER')) {
                console.warn("Using placeholder endpoint. Form submission simulated.");
                await new Promise(resolve => setTimeout(resolve, 1000)); // Fake network lag
                setIsSuccess(true);
                return;
            }

            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsSuccess(true);
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    setSubmitError(data["errors"].map(error => error["message"]).join(", "));
                } else {
                    setSubmitError("Something went wrong. Please try again.");
                }
            }
        } catch (err) {
            setSubmitError("Failed to connect to server. Please check your internet.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-2xl border border-teal-200 shadow-lg text-center animate-fade-in">
                <SEO title="Contact Us" description="Contact the LGBTQ+ & Drag Bingo Directory team." url="/contact" />
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 mb-6">
                    <svg className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-teal-900 mb-4">Thank You!</h1>
                <p className="text-xl text-slate-600 mb-8">
                    Your feedback has been received. I will get back to you as soon as I can, usually within 72 hours.
                </p>
                <Link
                    to="/"
                    className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl shadow-md hover:bg-teal-700 transition-colors"
                >
                    Return to Home Page
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-12 animate-fade-in">
            <SEO title="Contact Us" description="Get in touch with the LGBTQ+ & Drag Bingo Directory team for questions or feedback." url="/contact" />
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-6 text-center">Contact Us</h1>
                <p className="text-slate-600 mb-8 text-center text-lg">
                    We value your feedback. Please fill out the form below.
                </p>

                {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {submitError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* HONEYPOT FIELD - BOTS will fill this out, Formspree will filter them */}
                    <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-bold text-slate-700 mb-2">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.firstName ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-teal-200'} focus:outline-none focus:ring-4 transition-all`}
                                placeholder="Enter first name"
                            />
                            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-bold text-slate-700 mb-2">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.lastName ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-teal-200'} focus:outline-none focus:ring-4 transition-all`}
                                placeholder="Enter last name"
                            />
                            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-teal-200'} focus:outline-none focus:ring-4 transition-all`}
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {/* Comment */}
                    <div>
                        <label htmlFor="comment" className="block text-sm font-bold text-slate-700 mb-2">
                            Comment <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="comment"
                            name="comment"
                            rows="5"
                            value={formData.comment}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.comment ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-teal-200'} focus:outline-none focus:ring-4 transition-all`}
                            placeholder="Please share your thoughts..."
                        ></textarea>
                        <div className="flex justify-between mt-1">
                            {errors.comment ? (
                                <p className="text-sm text-red-600">{errors.comment}</p>
                            ) : (
                                <span></span>
                            )}
                            <p className={`text-sm ${formData.comment.length > 500 ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                                {formData.comment.length}/500
                            </p>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                            I will get back to you as soon as I can, normally in 72 hours.
                        </p>
                    </div>

                    {/* Captcha - Math Challenge */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <label htmlFor="mathAnswer" className="block text-sm font-bold text-slate-700 mb-2">
                            Security Check: What is {captcha.a} + {captcha.b}? <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="mathAnswer"
                            name="mathAnswer"
                            value={formData.mathAnswer}
                            onChange={handleChange}
                            className={`w-24 px-4 py-3 rounded-lg border ${errors.mathAnswer ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-teal-200'} focus:outline-none focus:ring-4 transition-all text-center font-bold text-lg`}
                            placeholder="?"
                        />
                        {errors.mathAnswer && <p className="mt-1 text-sm text-red-600">{errors.mathAnswer}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 text-lg font-bold text-white rounded-xl shadow-md transition-all ${isSubmitting
                            ? 'bg-slate-400 cursor-not-allowed'
                            : 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg hover:-translate-y-0.5'
                            }`}
                    >
                        {isSubmitting ? 'Sending...' : 'Submit Feedback'}
                    </button>

                    <p className="text-center text-xs text-slate-400 mt-4">
                        Protected by secure form submission.
                    </p>
                </form>
            </div>
        </div>
    );
}
