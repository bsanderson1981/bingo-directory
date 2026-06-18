import { Routes, Route, NavLink, Link } from 'react-router-dom'
import { SearchPage } from './components/SearchPage'
import { PrivacyPage } from './components/PrivacyPage'
import { TermsPage } from './components/TermsPage'
import { ConsumerBlog } from './components/ConsumerBlog'
import { SubstackBlog } from './components/SubstackBlog'
import { FeedbackForm } from './components/FeedbackForm'
import { ResourcesPage } from './components/ResourcesPage'


function App() {
  return (
    <div className="min-h-screen bg-slate-50 min-w-full font-sans selection:bg-teal-100 selection:text-teal-900">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center min-h-screen">

        {/* Header Section */}
        {/* Navigation Tabs */}
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200 mb-12">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-6 py-2 rounded-lg text-lg font-bold transition-all ${isActive
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-50'
              }`
            }
          >
            Find Bingo
          </NavLink>
          {/* 
          <NavLink
            to="/communityblog"
            className={({ isActive }) =>
              `px-6 py-2 rounded-lg text-lg font-bold transition-all ${isActive
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-50'
              }`
            }
          >
            Community Blog
          </NavLink>
          */}
        </div>

        {/* Routes */}
        <div className="w-full">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            {/* <Route path="/communityblog" element={<SubstackBlog />} /> */}
            <Route path="/contact" element={<FeedbackForm />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/state/:stateCode" element={<SearchPage />} />

          </Routes>
        </div>

        <footer className="mt-auto py-8 text-slate-700 text-sm flex flex-col items-center gap-2">
          <p>&copy; {new Date().getFullYear()} LGBTQ+ & Drag Bingo Directory</p>
          <div className="flex gap-4">
            <Link
              to="/privacy"
              className="hover:text-teal-600 transition-colors underline"
            >
              Privacy Policy
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              to="/terms"
              className="hover:text-teal-600 transition-colors underline"
            >
              Terms of Use
            </Link>
            <span className="text-slate-300">|</span>

            <Link
              to="/contact"
              className="hover:text-teal-600 transition-colors underline"
            >
              Contact Us
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
