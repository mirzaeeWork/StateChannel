import { Col, Alert, Container, Button, Row, ToastContainer, Toast, Form } from "react-bootstrap"
import { useContext, useEffect, useState } from 'react';
import { Web3Context } from "../context";
import NavbarComponent from '../Navbar/navbar';
import FundChannel from "./fundChannel";
import WithdrawEarnings from "./withdrawEarnings";
import ChallengeChannel from "./challengeChannel";
import DefundChannel from "./defundChannel";

const Home = () => {
    const { web3States, setWeb3State } = useContext(Web3Context)
    const [show, setShow] = useState(false);
    const [myShowToast, setMyShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [amountETH, setAmountETH] = useState()
    const [amountBalloons, setAmountBalloons] = useState()
    let getBalloonsBalanceAccount, getBalanceETHAcount, getBalloonsBalanceDEX, getETHBalanceDEX, takeOnMsgValueForDeposit, getLiquidityAcount
    let UpdateWeb3States = { ...web3States }






    useEffect(() => {
    },);


    return (
        <>
            <Col xs={6}>
                <ToastContainer className="p-3" position="top-center">
                    <Toast onClose={() => setShow(false)}
                        show={show} delay={5000} autohide>
                        <Toast.Header className={myShowToast ? "bg-success" : "bg-danger"}  >
                            <strong className="text-white me-auto">پیام</strong>
                        </Toast.Header>
                        <Toast.Body className="bg-light">{message}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Col>

            <NavbarComponent />


            <Container dir='rtl' className='mb-3'>
                <Row className='d-flex  justify-content-around mt-4' >
                    <Col xs={12} md={5} className='d-flex flex-column align-self-stretch py-3 ' style={{ backgroundColor: "rgb(187, 192, 190)" }}>
                        <FundChannel />
                    </Col>

                </Row>
                <Row className='d-flex  justify-content-around mt-4' >
                    <Col xs={12} md={5} className='d-flex flex-column align-self-stretch py-3 ' style={{ backgroundColor: "rgb(187, 192, 190)" }}>
                        <WithdrawEarnings/>
                    </Col>
                </Row>
                <Row className='d-flex  justify-content-around mt-4' >
                    <Col xs={12} md={5} className='d-flex flex-column align-self-stretch py-3 ' style={{ backgroundColor: "rgb(187, 192, 190)" }}>
                        <ChallengeChannel/>
                    </Col>
                </Row>

                <Row className='d-flex  justify-content-around mt-4' >
                    <Col xs={12} md={5} className='d-flex flex-column align-self-stretch py-3 ' style={{ backgroundColor: "rgb(187, 192, 190)" }}>
                        <DefundChannel/>
                    </Col>
                </Row>



            </Container>
        </>
    )
}

export default Home;