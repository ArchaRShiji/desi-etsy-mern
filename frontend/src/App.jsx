import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './Admin/AdminDashboard';
import PendingArtisans from './Admin/PendingArtisans';
import PendingProducts from './Admin/PendingProducts';
import Signin from './pages/Signin';
import Register from './pages/Register';
import ArtisanDashboard from './artisan/dashboard';
import ArtisanOrders from './artisan/ArtisanOrders';
import ArtisanProducts from './artisan/ArtisanProducts';
import ProductDetails from "./pages/ProductDetails";
import CompleteProfile from './pages/CompleteProfile';
import SearchResults from './pages/SearchResults';
import Homepage from './pages/Homepage';

function App(){
  return(
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/signin" element={<Signin/>} />
          <Route path="/register" element={<Register />} />

          <Route path="/product/:productId" element={<ProductDetails />} />
        
          <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
          <Route path="/artisan/ArtisanProducts" element={<ArtisanProducts />} />
          <Route path="/artisan/ArtisanOrders" element={<ArtisanOrders />} />

          <Route path="/Admin/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/Admin/PendingArtisans" element={<PendingArtisans />} />
          <Route path="/Admin/PendingProducts" element={<PendingProducts />} />

          <Route path="/complete-profile" element={<CompleteProfile />} />

          <Route path="/search" element={<SearchResults />} />

        </Routes>
    </BrowserRouter>
  );
}

export default App;