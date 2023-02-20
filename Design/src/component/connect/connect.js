import { Button, Col, Toast, ToastContainer } from "react-bootstrap"
import { useState, useContext, useEffect } from 'react';
import Web3 from "web3";
import { Web3Context } from "../context";
import { AbiStreamer } from "../ABI/ABI";


const Connect = () => {
    const { web3States, setWeb3State } = useContext(Web3Context)
    const [account, setAccount] = useState();
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    let UpdateWeb3States = { ...web3States }
    let getBalancesStake, contractStreamer, getBalanceETHAccount,getTImeLeft


    window.ethereum.on('accountsChanged', (accounts) => {
        connectToWallet()
    });

    window.ethereum.on('chainChanged', (chainId) => {
        setAccount()
    });
    async function connectToWallet() {
        let web3;
        if (typeof window.ethereum !== "undefined") {

            let accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            web3 = new Web3(Web3.givenProvider);
            web3.eth.getChainId().then(async res => {
                if (res == "80001") {
                    setAccount(accounts[0])
                    console.log(accounts[0])
                    contractStreamer = new web3.eth.Contract(AbiStreamer, "0x8e8724a04AD750A171B346919647CbcfbaA53AC8")
                    getBalancesStake = await contractStreamer.methods.getBalances().call({ from: accounts[0] })
                    getBalancesStake = Number(web3.utils.fromWei(getBalancesStake, 'ether')).toFixed(3);
                    getBalanceETHAccount = await web3.eth.getBalance(accounts[0]);
                    getBalanceETHAccount = Number(web3.utils.fromWei(getBalanceETHAccount, 'ether')).toFixed(3);
                    console.log(getBalanceETHAccount)
                    setWeb3State({ web3: web3, contractStreamer: contractStreamer, account: accounts[0],getBalancesStake:getBalancesStake
                        ,getBalanceETHAccount:getBalanceETHAccount})
                } else {
                    setMessage("mumbai شبکه تستی مد نظر می باشد")
                    setShow(true)
                }
            })
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            setMessage("متامسک را نصب کنید")
            setShow(true)
        }
    }


    async function startApp() {
        let web3;
        web3 = new Web3('https://rpc-mumbai.maticvigil.com');
        contractStreamer = new web3.eth.Contract(AbiStreamer, "0x8e8724a04AD750A171B346919647CbcfbaA53AC8")

        setWeb3State({ web3: web3, contractStreamer: contractStreamer, account: null,getBalancesStake:0
            ,getCanCloseAt:0,getBalanceETHAccount:null
        })


    }

    useEffect(() => {
        startApp()
    }, [])




    return (
        <>
            <Col xs={6}>
                <ToastContainer className="p-3" position="top-center">
                    <Toast onClose={() => setShow(false)}
                        show={show} delay={5000} autohide>
                        <Toast.Header className="text-white bg-danger">
                            <strong className="ms-auto">خطا</strong>
                        </Toast.Header>
                        <Toast.Body className="bg-light">{message}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Col>
            <Button onClick={connectToWallet} variant="outline-dark">
                {account ? (account.substring(0, 4) + '...' + account.slice(-4)) : 'اتصال به کیف پول'}
            </Button>
        </>
    );
}

export default Connect