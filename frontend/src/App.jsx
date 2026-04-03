import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerMarketplace from "./pages/BuyerMarketPlace";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import ProductsPage from "./pages/ProductsPage";
// import AI from './pages/Ai'; 
// import Weather from './pages/Weather';
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
      <Route path="/buyer-marketplace" element={<BuyerMarketplace />} />
      <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
      <Route path="/products" element={<ProductsPage />} />
      {/* <Route path="/ai" element={<AI />} />
      <Route path="/weather" element={<Weather />} /> */}
    </Routes>
  );
}

export default App;