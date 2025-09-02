import React, { useState, useEffect } from "react";
import { Table, Button, Card, Row, Col, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { resourceAPI } from "../services/api";
import { toast } from "react-toastify";

const ResourceList = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await resourceAPI.getAll();
      setResources(response.data);
    } catch (error) {
      toast.error("Failed to load resources");
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await resourceAPI.delete(id);
        toast.success("Resource deleted successfully");
        fetchResources();
      } catch (error) {
        toast.error("Failed to delete resource");
        console.error("Error deleting resource:", error);
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/resources/update/${id}`);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading resources...</div>;
  }

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h1>Resources</h1>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/resources/create" variant="success">
            Create New Resource
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          {resources.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No resources found</p>
              <Button as={Link} to="/resources/create" variant="primary">
                Create First Resource
              </Button>
            </div>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Client</th>
                  <th>Roles</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((resource) => (
                  <tr key={resource.id}>
                    <td>{resource.id}</td>
                    <td>
                      <strong>{resource.name}</strong>
                    </td>
                    <td>
                      <Badge bg="info">{resource.type}</Badge>
                    </td>
                    <td>
                      {resource.client ? (
                        <Badge bg="warning" text="dark">
                          {resource.client.name}
                        </Badge>
                      ) : (
                        <span className="text-muted">No client</span>
                      )}
                    </td>
                    <td>
                      {resource.roles && resource.roles.length > 0 ? (
                        <div>
                          {resource.roles.slice(0, 2).map((role, index) => (
                            <Badge key={index} bg="secondary" className="me-1">
                              {role.name}
                            </Badge>
                          ))}
                          {resource.roles.length > 2 && (
                            <Badge bg="light" text="dark">
                              +{resource.roles.length - 2} more
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted">No roles</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleUpdate(resource.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(resource.id)}
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

export default ResourceList;
