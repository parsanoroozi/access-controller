import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { accountAPI, clientAPI, roleAPI } from "../services/api";
import { toast } from "react-toastify";

const AccountCreate = () => {
  const [clients, setClients] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [clientsRes, rolesRes] = await Promise.all([
        clientAPI.getAll(),
        roleAPI.getAll(),
      ]);
      setClients(Array.isArray(clientsRes.data) ? clientsRes.data : []);
      setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);
    } catch (error) {
      toast.error("Failed to load dropdown data");
      console.error("Error fetching dropdown data:", error);
      setClients([]);
      setRoles([]);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Convert string IDs to numbers for relationships
      const accountData = {
        ...data,
        clientId: data.clientId ? parseInt(data.clientId) : null,
        roleId: data.roleId ? parseInt(data.roleId) : null,
      };

      await accountAPI.create(accountData);
      toast.success("Account created successfully");
      navigate("/accounts");
    } catch (error) {
      toast.error("Failed to create account");
      console.error("Error creating account:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h1>Create New Account</h1>
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={() => navigate("/accounts")}>
            Back to Accounts
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Username *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                    })}
                    isInvalid={!!errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password *</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Client</Form.Label>
                  <Form.Select {...register("clientId")}>
                    <option value="">Select a client (optional)</option>
                    {Array.isArray(clients) &&
                      clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name} (ID: {client.id})
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select {...register("roleId")}>
                    <option value="">Select a role (optional)</option>
                    {Array.isArray(roles) &&
                      roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name} - {role.type} (ID: {role.id})
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button type="submit" variant="success" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => reset()}>
                Reset Form
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate("/accounts")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AccountCreate;
