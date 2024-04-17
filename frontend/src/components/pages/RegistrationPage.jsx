import {
  Container,
  Row,
  Col,
  Card,
} from 'react-bootstrap';

import RegistrationForm from '../forms/RegistrationForm.jsx';

const RegistrationPage = () => (
  <Container fluid className="mt-5">
    <Row className="justify-content-center align-content-center h-100">
      <Col lg={6} md={8} xs={12}>
        <Card className="shadow-sm signup-card">
          <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-3 p-md-5">
            <RegistrationForm />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default RegistrationPage;
