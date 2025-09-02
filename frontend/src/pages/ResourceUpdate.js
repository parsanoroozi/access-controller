import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { resourceAPI, clientAPI } from "../services/api";
import { toast } from "react-toastify";

const ResourceUpdate = () => {
  const [resource, setResource] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setInitialLoading(true);
      const [resourceRes, clientsRes] = await Promise.all([
        resourceAPI.getById(parseInt(id)),
        clientAPI.getAll(),
      ]);

      setResource(resourceRes.data);
      setClients(Array.isArray(clientsRes.data) ? clientsRes.data : []);

      // Pre-fill the form
      setValue("name", resourceRes.data.name);
      setValue("type", resourceRes.data.type);
      setValue("url", resourceRes.data.url || "");
      setValue("action", resourceRes.data.action || "");
      setValue("description", resourceRes.data.description || "");
      setValue("clientId", resourceRes.data.client?.id?.toString() || "");
    } catch (error) {
      toast.error("Failed to load resource data");
      console.error("Error fetching data:", error);
      setClients([]);
      navigate("/resources");
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const resourceData = {
        id: parseInt(id),
        ...data,
        clientId: data.clientId ? parseInt(data.clientId) : null,
      };

      await resourceAPI.update(resourceData);
      toast.success("Resource updated successfully");
      navigate("/resources");
    } catch (error) {
      toast.error("Failed to update resource");
      console.error("Error updating resource:", error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="text-center mt-5">Loading resource data...</div>;
  }

  if (!resource) {
    return <div className="text-center mt-5">Resource not found</div>;
  }

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h1>Update Resource</h1>
          <p className="text-muted">Editing resource: {resource.name}</p>
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
                    <option value="WEB_PAGE_COMPONENT">Web Page Component</option>
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
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Updating..." : "Update Resource"}
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

export default ResourceUpdate;
