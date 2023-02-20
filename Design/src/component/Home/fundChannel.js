import { Col, Container, Button, Row, ToastContainer, Toast } from "react-bootstrap"
import { useContext, useEffect, useState } from 'react';
import { Web3Context } from "../context";


const FundChannel = () => {
    const { web3States, setWeb3State } = useContext(Web3Context)
    const [show, setShow] = useState(false);
    const [myShowToast, setMyShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [amountETH, setAmountETH] = useState()
    let UpdateWeb3States = { ...web3States }

    function fundChannel() {
        if (web3States.contractStreamer && web3States.account) {
            setMyShowToast(false)

            if (web3States.getBalanceETHAccount > amountETH
                && amountETH > 0) {
                contineufundChannel()
            } else {
                setMessage("ورودی وارد شده کمتر از موجودی اکانت و بزرگتر از صفر باشد")
                setShow(true)
            }
        } else {

            setMessage("ابتدا به کیف پول خود وصل شوید")
            setShow(true)

        }
    }

    async function contineufundChannel() {
        let getBalancesStake, getCanCloseAt
        const Amount = Number(amountETH) * 10 ** 18;
        web3States.contractStreamer.methods.fundChannel().send({
            from: web3States.account,
            value: Amount.toString()
        }).then(async result => {
            setShow(true)
            setMyShowToast(true)
            setAmountETH("")
            let _ethOutput = result.events.Opened.returnValues[1]
            _ethOutput = Number(web3States.web3.utils.fromWei(_ethOutput, 'ether')).toFixed(3)
            setMessage(`مقدار ${_ethOutput} اتر به قرارداد هوشمند واریز شد`)
            getBalancesStake = Number(await web3States.contractStreamer.methods.getBalances().call({ from: web3States.account })).toFixed(3)
            UpdateWeb3States.getBalancesStake = getBalancesStake
            getCanCloseAt = await web3States.contractStreamer.methods.getCanCloseAt().call({ from: web3States.account })
            UpdateWeb3States.getBalancesStake = getCanCloseAt
            setWeb3State(UpdateWeb3States)
        }).catch((error) => {
            setShow(true)
            setMessage("در حال حاضر فقط یکبار می توانید موجودی قفل کنید")

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
                        <label className=' mt-1'>مقدار ETH :</label>
                        <input type="number" id='AmountETH' className='form-control mt-1' name='AmountETH' value={amountETH} onChange={(e) => setAmountETH(e.target.value)} placeholder='تعداد ETH' />
                        <Button className='mt-3' variant="outline-dark" onClick={fundChannel}>
                            سرمایه گذاری (fundChannel)
                        </Button>
                    </Col>
                </Row>
            </Container>

        </>
    )
}

export default FundChannel