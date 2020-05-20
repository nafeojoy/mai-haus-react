import React from 'react'
import {
    Row,
    Col,
    Container
} from 'reactstrap';
import UploadImage from "../hocs/UploadImage";

function ProfileSetting() {
    return (
        <Container>
            <Row>
                <Col md={6}>Profile</Col>
                <Col md={6}>
                    <UploadImage />
                </Col>
            </Row>

        </Container>

    )
}

export default ProfileSetting
