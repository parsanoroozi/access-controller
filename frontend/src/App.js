import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import AccountList from "./pages/AccountList";
import AccountCreate from "./pages/AccountCreate";
import AccountUpdate from "./pages/AccountUpdate";
import ClientList from "./pages/ClientList";
import ClientCreate from "./pages/ClientCreate";
import ClientUpdate from "./pages/ClientUpdate";
import RoleList from "./pages/RoleList";
import RoleCreate from "./pages/RoleCreate";
import RoleUpdate from "./pages/RoleUpdate";
import ResourceList from "./pages/ResourceList";
import ResourceCreate from "./pages/ResourceCreate";
import ResourceUpdate from "./pages/ResourceUpdate";
import Authentication from "./pages/Authentication";
import Authorization from "./pages/Authorization";

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="container-fluid mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<AccountList />} />
            <Route path="/accounts/create" element={<AccountCreate />} />
            <Route path="/accounts/update/:id" element={<AccountUpdate />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/create" element={<ClientCreate />} />
            <Route path="/clients/update/:id" element={<ClientUpdate />} />
            <Route path="/roles" element={<RoleList />} />
            <Route path="/roles/create" element={<RoleCreate />} />
            <Route path="/roles/update/:id" element={<RoleUpdate />} />
            <Route path="/resources" element={<ResourceList />} />
            <Route path="/resources/create" element={<ResourceCreate />} />
            <Route path="/resources/update/:id" element={<ResourceUpdate />} />
            <Route path="/auth/authenticate" element={<Authentication />} />
            <Route path="/auth/authorize" element={<Authorization />} />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
