import React, { useState, useEffect } from "react";
import { Table, Button, Card, Row, Col, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { clientAPI } from "../services/api";
import { toast } from "react-toastify";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getAll();
      setClients(response.data);
    } catch (error) {
      toast.error("Failed to load clients");
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await clientAPI.delete(id);
        toast.success("Client deleted successfully");
        fetchClients();
      } catch (error) {
        toast.error("Failed to delete client");
        console.error("Error deleting client:", error);
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/clients/update/${id}`);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading clients...</div>;
  }

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h1>Clients</h1>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/clients/create" variant="success">
            Create New Client
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          {clients.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No clients found</p>
              <Button as={Link} to="/clients/create" variant="primary">
                Create First Client
              </Button>
            </div>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Secret</th>
                  <th>Passive Access Control</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.id}</td>
                    <td>
                      <strong>{client.name}</strong>
                    </td>
                    <td>
                      <code className="small">{client.secret}</code>
                    </td>
                    <td>
                      {client.hasPassiveAccessControl ? (
                        <Badge bg="success">Enabled</Badge>
                      ) : (
                        <Badge bg="secondary">Disabled</Badge>
                      )}
                    </td>
                    <td>
                      {client.role ? (
                        <Badge bg="warning" text="dark">
                          {client.role.name}
                        </Badge>
                      ) : (
                        <span className="text-muted">No role</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleUpdate(client.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(client.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ClientList;
