import { BrowserRouter, Routes, Route } from "react-router-dom";
import BasicTable from "./BasicTable";
import EditCustomerPage from "./EditCustomerPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BasicTable />} />
        <Route path="/edit" element={<EditCustomerPage />} />
      </Routes>
    </BrowserRouter>
  );
}
