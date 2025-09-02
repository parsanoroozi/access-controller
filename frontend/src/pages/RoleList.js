import React, { useState, useEffect } from "react";
import { Table, Button, Card, Row, Col, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { roleAPI } from "../services/api";
import { toast } from "react-toastify";

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await roleAPI.getAll();
      setRoles(response.data);
    } catch (error) {
      toast.error("Failed to load roles");
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await roleAPI.delete(id);
        toast.success("Role deleted successfully");
        fetchRoles();
      } catch (error) {
        toast.error("Failed to delete role");
        console.error("Error deleting role:", error);
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/roles/update/${id}`);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading roles...</div>;
  }

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h1>Roles</h1>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/roles/create" variant="success">
            Create New Role
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          {roles.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No roles found</p>
              <Button as={Link} to="/roles/create" variant="primary">
                Create First Role
              </Button>
            </div>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Resources</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.id}</td>
                    <td>
                      <strong>{role.name}</strong>
                    </td>
                    <td>
                      <Badge bg="info">{role.type}</Badge>
                    </td>
                    <td>
                      {role.resources && role.resources.length > 0 ? (
                        <div>
                          {role.resources.slice(0, 2).map((resource, index) => (
                            <Badge key={index} bg="secondary" className="me-1">
                              {resource.name}
                            </Badge>
                          ))}
                          {role.resources.length > 2 && (
                            <Badge bg="light" text="dark">
                              +{role.resources.length - 2} more
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted">No resources</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleUpdate(role.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(role.id)}
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

export default RoleList;
