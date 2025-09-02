import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { roleAPI, resourceAPI } from "../services/api";
import { toast } from "react-toastify";

const RoleUpdate = () => {
  const [role, setRole] = useState(null);
  const [resources, setResources] = useState([]);
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
      const [roleRes, resourcesRes] = await Promise.all([
        roleAPI.getById(parseInt(id)),
        resourceAPI.getAll(),
      ]);

      setRole(roleRes.data);
      setResources(Array.isArray(resourcesRes.data) ? resourcesRes.data : []);

      // Pre-fill the form
      setValue("name", roleRes.data.name);
      setValue("type", roleRes.data.type);
      setValue(
        "resourceIds",
        roleRes.data.resources?.map((r) => r.id.toString()) || []
      );
    } catch (error) {
      toast.error("Failed to load role data");
      console.error("Error fetching data:", error);
      setResources([]);
      navigate("/roles");
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const roleData = {
        id: parseInt(id),
        ...data,
        resourceIds: data.resourceIds
          ? data.resourceIds.map((id) => parseInt(id))
          : [],
      };

      await roleAPI.update(roleData);
      toast.success("Role updated successfully");
      navigate("/roles");
    } catch (error) {
      toast.error("Failed to update role");
      console.error("Error updating role:", error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="text-center mt-5">Loading role data...</div>;
  }

  if (!role) {
    return <div className="text-center mt-5">Role not found</div>;
  }

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h1>Update Role</h1>
          <p className="text-muted">Editing role: {role.name}</p>
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
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Updating..." : "Update Role"}
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

export default RoleUpdate;
