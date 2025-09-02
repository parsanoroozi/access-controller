import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          🔐 Access Controller Admin
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === "/"}>
              Dashboard
            </Nav.Link>

            <NavDropdown title="Entities" id="entities-dropdown">
              <NavDropdown.Item as={Link} to="/accounts">
                Accounts
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/clients">
                Clients
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/roles">
                Roles
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/resources">
                Resources
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Authentication" id="auth-dropdown">
              <NavDropdown.Item as={Link} to="/auth/authenticate">
                Login
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/auth/authorize">
                Check Access
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
