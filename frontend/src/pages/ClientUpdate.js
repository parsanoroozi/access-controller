import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { clientAPI, roleAPI } from "../services/api";
import { toast } from "react-toastify";

const ClientUpdate = () => {
  const [client, setClient] = useState(null);
  const [roles, setRoles] = useState([]);
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
      const [clientRes, rolesRes] = await Promise.all([
        clientAPI.getById(parseInt(id)),
        roleAPI.getAll(),
      ]);

      setClient(clientRes.data);
      setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);

      // Pre-fill the form
      setValue("name", clientRes.data.name);
      setValue("secret", clientRes.data.secret);
      setValue("roleId", clientRes.data.role?.id?.toString() || "");
      setValue(
        "hasPassiveAccessControl",
        clientRes.data.hasPassiveAccessControl ? "true" : "false"
      );
    } catch (error) {
      toast.error("Failed to load client data");
      console.error("Error fetching data:", error);
      setRoles([]);
      navigate("/clients");
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const clientData = {
        id: parseInt(id),
        ...data,
        roleId: data.roleId ? parseInt(data.roleId) : null,
        hasPassiveAccessControl: data.hasPassiveAccessControl === "true",
      };

      // delete clientData.roleId;

      // Only include secret if it was changed
      if (!data.secret) {
        delete clientData.secret;
      }

      await clientAPI.update(clientData);
      toast.success("Client updated successfully");
      navigate("/clients");
    } catch (error) {
      toast.error("Failed to update client");
      console.error("Error updating client:", error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="text-center mt-5">Loading client data...</div>;
  }

  if (!client) {
    return <div className="text-center mt-5">Client not found</div>;
  }

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h1>Update Client</h1>
          <p className="text-muted">Editing client: {client.name}</p>
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
                  <Form.Label>Secret</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Leave blank to keep current secret"
                    {...register("secret")}
                  />
                  <Form.Text className="text-muted">
                    Leave blank to keep the current secret
                  </Form.Text>
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
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Updating..." : "Update Client"}
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

export default ClientUpdate;
