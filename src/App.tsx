import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Classes from "./pages/Classes";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />


        <Route path="/trpl-reg-24" element={<Classes kategori="TRPL24" />} />
        <Route path="/trpl-reg-25" element={<Classes kategori="TRPL25" />} />
        <Route path="/bisdig-reg-24" element={<Classes kategori="BISDIG24" />} />
        <Route path="/bisdig-reg-25" element={<Classes kategori="BISDIG25" />} />
        <Route path="/bisdig-eks-24" element={<Classes kategori="BISDIGeks24" />} />
        <Route path="/bisdig-eks-25" element={<Classes kategori="BISDIGeks25" />} />



        <Route path="/dashboard-all" element={<Classes />} />




        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;