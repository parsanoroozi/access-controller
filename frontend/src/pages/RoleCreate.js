import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { roleAPI, resourceAPI } from "../services/api";
import { toast } from "react-toastify";

const RoleCreate = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await resourceAPI.getAll();
      setResources(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error("Failed to load resources");
      console.error("Error fetching resources:", error);
      setResources([]);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const roleData = {
        ...data,
        resourceIds: data.resourceIds
          ? data.resourceIds.map((id) => parseInt(id))
          : [],
      };

      await roleAPI.create(roleData);
      toast.success("Role created successfully");
      navigate("/roles");
    } catch (error) {
      toast.error("Failed to create role");
      console.error("Error creating role:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h1>Create New Role</h1>
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={() => navigate("/roles")}>
            Back to Roles
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
                    placeholder="Enter role name"
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
                    <option value="">Select role type</option>
                    <option value="ADMIN">Admin</option>
                    <option value="ACCOUNT">Account</option>
                    <option value="CLIENT">Client</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.type?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Resources</Form.Label>
                  <Form.Select multiple {...register("resourceIds")} size="4">
                    {Array.isArray(resources) &&
                      resources.map((resource) => (
                        <option key={resource.id} value={resource.id}>
                          {resource.name} - {resource.type} (ID: {resource.id})
                        </option>
                      ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Hold Ctrl (or Cmd on Mac) to select multiple resources
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button type="submit" variant="success" disabled={loading}>
                {loading ? "Creating..." : "Create Role"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => reset()}>
                Reset Form
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate("/roles")}
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

export default RoleCreate;
