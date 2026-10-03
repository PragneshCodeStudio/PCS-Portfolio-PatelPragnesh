import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Projects from './pages/Projects/Projects'
import Contact from './pages/Contact/Contact'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/layout/ScrollToTop'
import SmoothScroll from './components/layout/SmoothScroll'
import SplashScreen from './components/layout/SplashScreen'
import { PageTransitionProvider } from './context/PageTransitionContext.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <PageTransitionProvider>
        <SplashScreen />
        <ScrollToTop />
        <Header />
        <SmoothScroll>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Navigate to="/" replace />} />
            <Route path="/experience" element={<Navigate to="/about" replace />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </SmoothScroll>
      </PageTransitionProvider>
    </BrowserRouter>
  )
}

export default App
