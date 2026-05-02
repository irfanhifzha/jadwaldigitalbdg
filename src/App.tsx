import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import TrplReg24  from "./pages/trpl-reg-24";
import BisdigReg24  from "./pages/bisdig-reg-24";
import TrplReg25  from "./pages/trpl-reg-25";
import BisdigReg25  from "./pages/bisdig-reg-25";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/trpl-reg-24" element={<TrplReg24 />} />
        <Route path="/bisdig-reg-24" element={<BisdigReg24 />} />
        <Route path="/trpl-reg-25" element={<TrplReg25 />} />
        <Route path="/bisdig-reg-25" element={<BisdigReg25 />} />

       


        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;