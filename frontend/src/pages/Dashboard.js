import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { accountAPI, clientAPI, roleAPI, resourceAPI } from "../services/api";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState({
    accounts: 0,
    clients: 0,
    roles: 0,
    resources: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [accountsRes, clientsRes, rolesRes, resourcesRes] =
          await Promise.all([
            accountAPI.getAll(),
            clientAPI.getAll(),
            roleAPI.getAll(),
            resourceAPI.getAll(),
          ]);

        setStats({
          accounts: accountsRes.data.length,
          clients: clientsRes.data.length,
          roles: rolesRes.data.length,
          resources: resourcesRes.data.length,
        });
      } catch (error) {
        toast.error("Failed to load dashboard statistics");
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: "Accounts",
      description: "Manage user accounts and authentication",
      count: stats.accounts,
      link: "/accounts",
      color: "primary",
      icon: "👤",
    },
    {
      title: "Clients",
      description: "Manage client applications",
      count: stats.clients,
      link: "/clients",
      color: "success",
      icon: "🏢",
    },
    {
      title: "Roles",
      description: "Manage user roles and permissions",
      count: stats.roles,
      link: "/roles",
      color: "warning",
      icon: "🔑",
    },
    {
      title: "Resources",
      description: "Manage system resources",
      count: stats.resources,
      link: "/resources",
      color: "info",
      icon: "📁",
    },
  ];

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>

      <Row>
        {quickActions.map((action, index) => (
          <Col key={index} md={6} lg={3} className="mb-4">
            <Card className={`border-${action.color} h-100`}>
              <Card.Body className="text-center">
                <div className="display-4 mb-3">{action.icon}</div>
                <Card.Title>{action.title}</Card.Title>
                <Card.Text>{action.description}</Card.Text>
                <div className="mb-3">
                  <span className="badge bg-secondary fs-6">
                    {action.count} items
                  </span>
                </div>
                <Button as={Link} to={action.link} variant={action.color}>
                  Manage {action.title}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Authentication</h5>
            </Card.Header>
            <Card.Body>
              <p>Test authentication and authorization endpoints</p>
              <div className="d-grid gap-2">
                <Button
                  as={Link}
                  to="/auth/authenticate"
                  variant="outline-primary"
                >
                  Test Authentication
                </Button>
                <Button
                  as={Link}
                  to="/auth/authorize"
                  variant="outline-secondary"
                >
                  Test Authorization
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <p>Common administrative tasks</p>
              <div className="d-grid gap-2">
                <Button
                  as={Link}
                  to="/accounts/create"
                  variant="outline-success"
                  size="sm"
                >
                  Create New Account
                </Button>
                <Button
                  as={Link}
                  to="/clients/create"
                  variant="outline-success"
                  size="sm"
                >
                  Create New Client
                </Button>
                <Button
                  as={Link}
                  to="/roles/create"
                  variant="outline-success"
                  size="sm"
                >
                  Create New Role
                </Button>
                <Button
                  as={Link}
                  to="/resources/create"
                  variant="outline-success"
                  size="sm"
                >
                  Create New Resource
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
