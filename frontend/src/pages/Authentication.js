import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { accountAPI } from "../services/api";
import { toast } from "react-toastify";

const Authentication = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setResult(null);

      const response = await accountAPI.authenticate(data);
      setResult(response.data);

      if (response.data.authenticated) {
        toast.success("Authentication successful!");
      } else {
        toast.error(`Authentication failed: ${response.data.description}`);
      }
    } catch (error) {
      toast.error("Authentication request failed");
      console.error("Authentication error:", error);
      setResult({
        authenticated: false,
        description: "Request failed - check console for details",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h1>Authentication Test</h1>
          <p className="text-muted">
            Test user authentication with credentials
          </p>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Authentication Request</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>Client Secret *</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter client secret"
                    {...register("clientSecret", {
                      required: "Client secret is required",
                    })}
                    isInvalid={!!errors.clientSecret}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.clientSecret?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Username *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    isInvalid={!!errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password *</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? "Authenticating..." : "Authenticate"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => reset()}
                  >
                    Reset Form
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Authentication Result</h5>
            </Card.Header>
            <Card.Body>
              {result ? (
                <div>
                  <Alert variant={result.authenticated ? "success" : "danger"}>
                    <strong>
                      {result.authenticated
                        ? "✅ Authentication Successful"
                        : "❌ Authentication Failed"}
                    </strong>
                  </Alert>

                  <div className="mb-3">
                    <strong>Description:</strong>
                    <p className="text-muted">{result.description}</p>
                  </div>

                  {result.authenticated && (
                    <>
                      {result.accessToken && (
                        <div className="mb-3">
                          <strong>Access Token:</strong>
                          <div className="bg-light p-2 rounded">
                            <code className="small">{result.accessToken}</code>
                          </div>
                        </div>
                      )}

                      {result.refreshToken && (
                        <div className="mb-3">
                          <strong>Refresh Token:</strong>
                          <div className="bg-light p-2 rounded">
                            <code className="small">{result.refreshToken}</code>
                          </div>
                        </div>
                      )}

                      {result.resources && result.resources.length > 0 && (
                        <div className="mb-3">
                          <strong>Available Resources:</strong>
                          <ul className="list-unstyled">
                            {result.resources.map((resource, index) => (
                              <li
                                key={index}
                                className="badge bg-info me-1 mb-1"
                              >
                                {resource.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <p className="text-muted">
                  No authentication result yet. Submit the form to test
                  authentication.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Authentication;
