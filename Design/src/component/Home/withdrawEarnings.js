import { Col, Container, Button, Row, ToastContainer, Toast } from "react-bootstrap"
import { useContext, useEffect, useState } from 'react';
import { Web3Context } from "../context";


const WithdrawEarnings = () => {
    const { web3States, setWeb3State } = useContext(Web3Context)
    const [show, setShow] = useState(false);
    const [myShowToast, setMyShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [amountETH, setAmountETH] = useState()
    const [signer, setSigner] = useState({})
    let UpdateWeb3States = { ...web3States }

    function withdrawEarnings(){
        if (web3States.contractStreamer ) {
            setMyShowToast(false)
            if (web3States.getBalancesStake > amountETH
                && amountETH > 0) {
                    const Amount = Number(amountETH) * 10 ** 18;
                    web3States.web3.eth.personal.sign(Amount.toString(), web3States.account, "امضای شخصی")
                    .then(sign => {
                      console.log("signerr : " + sign)
                      const r = sign.slice(0, 66);
                      const s = "0x" + sign.slice(66, 130);
                      const v = parseInt(sign.slice(130, 132), 16);
                      console.log( "R :" + r + " , " + "S :" + s + " , " + "V :" + v);
                      setSigner({v,r,s})
                      let promise = web3States.contractStreamer.methods.verifyString(Amount.toString(), signer.v,signer.r,signer.s).call()
                      promise.then(function (signerr) {    // Check the computed signer matches the actual signer
                        
                        console.log(signerr.toLowerCase() === web3States.account.toLowerCase());
            
                      });
            
                      ContinuewithdrawEarnings()
                    });
            
                   
            } else {
                setMessage("ورودی وارد شده کوچکتر از اتر قفل شده و بزرگتر از صفر باشد")
                setShow(true)
            }
        } else {

            setMessage("ابتدا به کیف پول خود وصل شوید")
            setShow(true)

        }


    }


     function ContinuewithdrawEarnings() {
        let getBalancesStake,getCanCloseAt
        const Amount = Number(amountETH) * 10 ** 18;

            web3States.contractStreamer.methods.withdrawEarnings(Amount.toString(),
            signer.v,signer.r,signer.s).send({
                from: web3States.account }).then(async result => {
                setShow(true)
                setMyShowToast(true)
                setAmountETH("")
                let _ethOutput = result.events.Withdrawn.returnValues[1]
                _ethOutput = Number(web3States.web3.utils.fromWei(_ethOutput, 'ether')).toFixed(3)
                setMessage(`مقدار ${_ethOutput} برداشت شد`)
                getBalancesStake = Number(await web3States.contractStreamer.methods.getBalances().call({from:web3States.account})).toFixed(3)
                UpdateWeb3States.getBalancesStake=getBalancesStake
                setWeb3State(UpdateWeb3States)
            }).catch((error) => {
                setShow(true)
                setMessage("انتقال اتر انجام نشد یا تا پایان زمان باقی مانده نمی توان کل موجودی را انتقال داد")

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
                    <Col  className='d-flex flex-column align-self-stretch py-4 ' style={{ backgroundColor: "rgb(187, 192, 190)" }}>
                        <label className=' mt-1'>مقدار ETH :</label>
                        <input type="number" id='AmountETH' className='form-control mt-1' name='AmountETH' value={amountETH} onChange={(e) => setAmountETH(e.target.value)} placeholder='تعداد ETH' />
                        <Button className='mt-3'  variant="outline-dark" onClick={withdrawEarnings}>
                           امضا و برداشت از صندوق  (withdrawEarnings)
                        </Button>
                    </Col>
                </Row>
            </Container>

        </>
    )
}

export default WithdrawEarnings