import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { accountAPI, clientAPI, roleAPI } from "../services/api";
import { toast } from "react-toastify";

const AccountUpdate = () => {
  const [account, setAccount] = useState(null);
  const [clients, setClients] = useState([]);
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
      const [accountRes, clientsRes, rolesRes] = await Promise.all([
        accountAPI.getById(parseInt(id)),
        clientAPI.getAll(),
        roleAPI.getAll(),
      ]);

      setAccount(accountRes.data);
      setClients(Array.isArray(clientsRes.data) ? clientsRes.data : []);
      setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);

      // Pre-fill the form
      setValue("username", accountRes.data.username);
      setValue("password", ""); // Don't pre-fill password for security
      setValue("clientId", accountRes.data.client?.id?.toString() || "");
      setValue("roleId", accountRes.data.role?.id?.toString() || "");
    } catch (error) {
      toast.error("Failed to load account data");
      console.error("Error fetching data:", error);
      setClients([]);
      setRoles([]);
      navigate("/accounts");
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Convert string IDs to numbers for relationships
      const accountData = {
        id: parseInt(id),
        ...data,
        clientId: data.clientId ? parseInt(data.clientId) : null,
        roleId: data.roleId ? parseInt(data.roleId) : null,
      };

      // Only include password if it was changed
      if (!data.password) {
        delete accountData.password;
      }

      await accountAPI.update(accountData);
      toast.success("Account updated successfully");
      navigate("/accounts");
    } catch (error) {
      toast.error("Failed to update account");
      console.error("Error updating account:", error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="text-center mt-5">Loading account data...</div>;
  }

  if (!account) {
    return <div className="text-center mt-5">Account not found</div>;
  }

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h1>Update Account</h1>
          <p className="text-muted">Editing account: {account.username}</p>
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
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Leave blank to keep current password"
                    {...register("password")}
                  />
                  <Form.Text className="text-muted">
                    Leave blank to keep the current password
                  </Form.Text>
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
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Updating..." : "Update Account"}
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

export default AccountUpdate;
