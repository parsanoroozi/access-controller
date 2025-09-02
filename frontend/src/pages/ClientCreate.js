import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { clientAPI, roleAPI } from "../services/api";
import { toast } from "react-toastify";

const ClientCreate = () => {
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
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await roleAPI.getAll();
      setRoles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error("Failed to load roles");
      console.error("Error fetching roles:", error);
      setRoles([]);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const clientData = {
        ...data,
        roleId: data.roleId ? parseInt(data.roleId) : null,
        hasPassiveAccessControl: data.hasPassiveAccessControl === "true",
      };

      // delete clientData.roleId;

      await clientAPI.create(clientData);
      toast.success("Client created successfully");
      navigate("/clients");
    } catch (error) {
      toast.error("Failed to create client");
      console.error("Error creating client:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h1>Create New Client</h1>
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={() => navigate("/clients")}>
            Back to Clients
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter client name"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Secret *</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter client secret"
                    {...register("secret", {
                      required: "Secret is required",
                      minLength: {
                        value: 6,
                        message: "Secret must be at least 6 characters",
                      },
                    })}
                    isInvalid={!!errors.secret}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.secret?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
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

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Passive Access Control</Form.Label>
                  <Form.Select {...register("hasPassiveAccessControl")}>
                    <option value="false">Disabled</option>
                    <option value="true">Enabled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button type="submit" variant="success" disabled={loading}>
                {loading ? "Creating..." : "Create Client"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => reset()}>
                Reset Form
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate("/clients")}
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

export default ClientCreate;
