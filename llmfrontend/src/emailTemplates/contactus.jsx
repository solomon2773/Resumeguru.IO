import * as React from 'react';
import { Container, Button, Html } from "@react-email/components";

export function Contactus(props) {
    const { submitData } = props;

    return (
        <Html lang="en">
            <Container>
                <div>First Name : {submitData.firstName}</div>
                <div>Last Name : {submitData.lastName}</div>
                <div>Email : {submitData.email}</div>
                <div>Phone : {submitData.phone}</div>
                <div>Message : {submitData.message}</div>
                <div>Company : {submitData.company}</div>
            </Container>
        </Html>
    );
}
