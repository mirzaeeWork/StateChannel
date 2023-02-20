import { Col, Container, Button, Row, ToastContainer, Toast } from "react-bootstrap"
import { useContext, useEffect, useState } from 'react';
import { Web3Context } from "../context";


const DefundChannel = () => {
    const { web3States, setWeb3State } = useContext(Web3Context)
    const [show, setShow] = useState(false);
    const [myShowToast, setMyShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [newTime, setNewTime] = useState()
    let UpdateWeb3States = { ...web3States }

    function defundChannel() {
        setMyShowToast(false)
        if (web3States.contractStreamer && web3States.account) {
            contineudefundChannel()
        } else {

            setMessage("ابتدا به کیف پول خود وصل شوید")
            setShow(true)

        }
    }

    async function contineudefundChannel() {
        let getBalancesStake, getCanCloseAt
        web3States.contractStreamer.methods.defundChannel().send({
            from: web3States.account,
        }).then(async result => {
            setShow(true)
            setMyShowToast(true)
            setNewTime("")
            let MsgSender = result.events.Closed.returnValues[0]
            setMessage(`کانال صندوق به آدرس ${MsgSender} بسته شد`)
            web3States.contractStreamer.methods.timeLeft(web3States.account).call().then(res => {
                UpdateWeb3States.getTimeleft = res
            })
            getBalancesStake = (await web3States.contractStreamer.methods.getBalances().call({ from: web3States.account }))
            getBalancesStake = Number(web3States.web3.utils.fromWei(getBalancesStake, 'ether')).toFixed(3);
            UpdateWeb3States.getBalancesStake = getBalancesStake

            setWeb3State(UpdateWeb3States)
        }).catch((error) => {
            setShow(true)
            setMessage("کانال ایجاد نکرده یا زمان کانال به پایان نرسیده یاکانال بسته شده است")

        })

    }

    return (
        <>
            <Col xs={6}>
                <ToastContainer className="p-3" position="top-center">
                    <Toast onClose={() => setShow(false)}
                        show={show} delay={5000} autohide>
                        <Toast.Header className={myShowToast ? "bg-success" : "bg-danger"}  >
                            <strong className="text-white ms-auto">پیام</strong>
                        </Toast.Header>
                        <Toast.Body className="bg-light">{message}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Col>

            <Container >
                <Row className=' d-flex justify-content-around ' >
                    <Col className='d-flex flex-column align-self-stretch py-4 ' style={{ backgroundColor: "rgb(187, 192, 190)" }}>
                        <label className=' mt-1'>بستن کانال صندوق :</label>
                        <Button className='mt-3' variant="outline-dark" onClick={defundChannel}>
                          بستن کانال صندوق (defundChannel)
                        </Button>
                    </Col>
                </Row>
            </Container>

        </>
    )
}

export default DefundChannel