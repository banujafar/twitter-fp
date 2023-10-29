import { Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      {/* <h1 className=" text-sm text-cyan-400">Hello world!</h1> */}
    </>
  );
}

export default App;