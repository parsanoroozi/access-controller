import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { resourceAPI, clientAPI } from "../services/api";
import { toast } from "react-toastify";

const ResourceCreate = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await clientAPI.getAll();
      // Ensure clients is always an array
      setClients(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error("Failed to load clients");
      console.error("Error fetching clients:", error);
      setClients([]); // Set empty array on error
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const resourceData = {
        ...data,
        clientId: data.clientId ? parseInt(data.clientId) : null,
      };

      await resourceAPI.create(resourceData);
      toast.success("Resource created successfully");
      navigate("/resources");
    } catch (error) {
      toast.error("Failed to create resource");
      console.error("Error creating resource:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h1>Create New Resource</h1>
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={() => navigate("/resources")}>
            Back to Resources
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
                    placeholder="Enter resource name"
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
                  <Form.Label>Type *</Form.Label>
                  <Form.Select
                    {...register("type", {
                      required: "Type is required",
                    })}
                    isInvalid={!!errors.type}
                  >
                    <option value="">Select resource type</option>
                    <option value="API_ENDPOINT">API Endpoint</option>
                    <option value="WEB_PAGE">Web Page</option>
                    <option value="WEB_PAGE_COMPONENT">
                      Web Page Component
                    </option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.type?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Action *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter resource action (e.g., GET, POST, READ, WRITE)"
                    {...register("action", {
                      required: "Action is required",
                      minLength: {
                        value: 2,
                        message: "Action must be at least 2 characters",
                      },
                    })}
                    isInvalid={!!errors.action}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.action?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter resource URL (e.g., /api/users, /admin/dashboard)"
                    {...register("url")}
                  />
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
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter resource description"
                    {...register("description")}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button type="submit" variant="success" disabled={loading}>
                {loading ? "Creating..." : "Create Resource"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => reset()}>
                Reset Form
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate("/resources")}
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

export default ResourceCreate;
