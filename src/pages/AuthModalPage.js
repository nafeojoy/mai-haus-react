import AuthForm, { STATE_LOGIN } from './../components/AuthForm';
import Page from 'components/Page';
import React, { useState }  from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  Row,
} from 'reactstrap';



function AuthModalPage(props) {


  const [show, setShow] = useState(false);
  const [authState, setAuthState] = useState(STATE_LOGIN);
  console.log('AuthModalPage')
  console.log(props)

  const toggle = () => {
    setShow(!show);
  };

  const handleAuthState = authState => {
    setAuthState(authState);
  };

  const externalCloseBtn = (
    <button
      className="close"
      style={{
        position: 'absolute',
        top: '15px',
        right: '20px',
        fontSize: '3rem',
      }}
      onClick={toggle}>
      &times;
    </button>
  );
  return (
    <Page
        title="Login Modal"
        breadcrumbs={[{ name: 'login', active: true }]}>
        <Row>
          <Col md="12" sm="12" xs="12">
            <Card>
              <CardHeader>Login</CardHeader>
              <CardBody>
                <Button color="primary" onClick={toggle}>
                  Click to Login
                </Button>
                <Modal
                  isOpen={show}
                  toggle={toggle}
                  size="md"
                  backdrop="static"
                  backdropClassName="modal-backdrop-light"
                  external={externalCloseBtn}
                  centered>
                  <ModalBody>
                    <AuthForm
                      authState={authState}
                      onChangeAuthState={handleAuthState}
                    />
                  </ModalBody>
                </Modal>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Page>
  )
}

export default AuthModalPage

