import { Routes, Route } from "react-router"
import SignupPage from "./Pages/SignupPage"
import SigninPage from "./Pages/SigninPage"
import HomePage from "./Pages/HomePage"
import EditJobPage from "./Pages/EditJobPage"
import AddJobPage from "./Pages/AddJobPage"

export default function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs/new" element={<AddJobPage />} />
      <Route path="/jobs/:id/edit" element={<EditJobPage />} />
    </Routes>
  )
}