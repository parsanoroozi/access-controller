import React, { useState, useEffect } from "react";
import { Table, Button, Card, Row, Col, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { accountAPI } from "../services/api";
import { toast } from "react-toastify";

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountAPI.getAll();
      setAccounts(response.data);
    } catch (error) {
      toast.error("Failed to load accounts");
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await accountAPI.delete(id);
        toast.success("Account deleted successfully");
        fetchAccounts();
      } catch (error) {
        toast.error("Failed to delete account");
        console.error("Error deleting account:", error);
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/accounts/update/${id}`);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading accounts...</div>;
  }

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h1>Accounts</h1>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/accounts/create" variant="success">
            Create New Account
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          {accounts.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No accounts found</p>
              <Button as={Link} to="/accounts/create" variant="primary">
                Create First Account
              </Button>
            </div>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Client</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td>{account.id}</td>
                    <td>
                      <strong>{account.username}</strong>
                    </td>
                    <td>
                      {account.client ? (
                        <Badge bg="info">{account.client.name}</Badge>
                      ) : (
                        <span className="text-muted">No client</span>
                      )}
                    </td>
                    <td>
                      {account.role ? (
                        <Badge bg="warning" text="dark">
                          {account.role.name}
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
                          onClick={() => handleUpdate(account.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(account.id)}
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

export default AccountList;
