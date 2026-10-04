import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import SmoothScroll from './SmoothScroll'
import SplashScreen from './SplashScreen'
import { PageTransitionProvider } from '../../context/PageTransitionContext.jsx'

const PortfolioLayout = () => (
  <PageTransitionProvider>
    <SplashScreen />
    <Header />
    <SmoothScroll>
      <Outlet />
      <Footer />
    </SmoothScroll>
  </PageTransitionProvider>
)

export default PortfolioLayout
