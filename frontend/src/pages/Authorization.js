import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { accountAPI } from "../services/api";
import { toast } from "react-toastify";

const Authorization = () => {
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

      const response = await accountAPI.checkAccess(data);
      setResult(response.data);

      if (response.data.allowed) {
        toast.success("Access granted!");
      } else {
        toast.error(`Access denied: ${response.data.description}`);
      }
    } catch (error) {
      toast.error("Authorization request failed");
      console.error("Authorization error:", error);
      setResult({
        authenticated: false,
        allowed: false,
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
          <h1>Authorization Test</h1>
          <p className="text-muted">Test resource access authorization</p>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Authorization Request</h5>
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
                  <Form.Label>Access Token *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter access token"
                    {...register("accessToken", {
                      required: "Access token is required",
                    })}
                    isInvalid={!!errors.accessToken}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.accessToken?.message}
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
                  <Form.Label>Resource Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter resource name to check access"
                    {...register("resourceName", {
                      required: "Resource name is required",
                    })}
                    isInvalid={!!errors.resourceName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.resourceName?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? "Checking Access..." : "Check Access"}
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
              <h5>Authorization Result</h5>
            </Card.Header>
            <Card.Body>
              {result ? (
                <div>
                  <Alert variant={result.allowed ? "success" : "danger"}>
                    <strong>
                      {result.allowed
                        ? "✅ Access Granted"
                        : "❌ Access Denied"}
                    </strong>
                  </Alert>

                  <div className="mb-3">
                    <strong>Authentication Status:</strong>
                    <span
                      className={`badge ${
                        result.authenticated ? "bg-success" : "bg-danger"
                      } ms-2`}
                    >
                      {result.authenticated
                        ? "Authenticated"
                        : "Not Authenticated"}
                    </span>
                  </div>

                  <div className="mb-3">
                    <strong>Description:</strong>
                    <p className="text-muted">{result.description}</p>
                  </div>

                  {result.allowed && (
                    <>
                      {result.accessToken && (
                        <div className="mb-3">
                          <strong>New Access Token:</strong>
                          <div className="bg-light p-2 rounded">
                            <code className="small">{result.accessToken}</code>
                          </div>
                        </div>
                      )}

                      {result.refreshToken && (
                        <div className="mb-3">
                          <strong>New Refresh Token:</strong>
                          <div className="bg-light p-2 rounded">
                            <code className="small">{result.refreshToken}</code>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <p className="text-muted">
                  No authorization result yet. Submit the form to test access.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Authorization;
