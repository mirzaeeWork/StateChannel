import { Nav, Navbar, Container, NavDropdown, Button } from "react-bootstrap"
import { useState, useContext, useEffect } from 'react';
import Connect from "../connect/connect";
import { Web3Context } from "../context";



const NavbarComponent = () => {
    const { web3States, setWeb3State } = useContext(Web3Context)
    const [time, setTime] = useState(0)
    const [secondtime, setSecondTime] = useState(0)
    let getBalancesStake
    let UpdateWeb3States = { ...web3States }

    // async function LowTime() {
    //     if (web3States.contractStreamer) {
    //        const getCanCloseAt=await web3States.contractStreamer.methods.getCanCloseAt().call({from:web3States.account})
    //        gettime(getCanCloseAt)
    //     }
    // }

    async function LowTime(){
        if(web3States.contractStreamer){
            web3States.contractStreamer.methods.timeLeft(web3States.account).call().then(res=>{
                UpdateWeb3States.getTimeleft=res
                setWeb3State(UpdateWeb3States)

             setTime(res)
            })
        }
    }

   async function getBalancStaker(){
        if (web3States.contractStreamer) {
            getBalancesStake = (await web3States.contractStreamer.methods.getBalances().call({from:web3States.account}))
            getBalancesStake =Number(web3States.web3.utils.fromWei(getBalancesStake, 'ether')).toFixed(3);
            UpdateWeb3States.getBalancesStake=getBalancesStake
            setWeb3State(UpdateWeb3States)
        }
    }

    function displayTime(){
        let day=Math.floor(time / 86400);
        let hours = Math.floor((time % 86400)/3600);
        let minutes = Math.floor((time % 3600) / 60);
        let seconds = Math.floor(time % 60)
        // Display a leading zero if the values are less than ten
        let displayDay=(day<100?'0'+day:day);
        let displayHours = (hours < 10) ? '0' + hours : hours;
        let displayMinutes = (minutes < 10) ? '0' + minutes : minutes;
        let displaySeconds = (seconds < 10) ? '0' + seconds : seconds;
        // Write the current stopwatch display time into the display paragraph
        setSecondTime(displayDay+" dd , "+ displayHours + ':' + displayMinutes + ':' + displaySeconds);

    }

    useEffect(() => {
        time > 0 && setTimeout(() => setTime(time - 1), 1000);
        displayTime()
    }, [time])



    useEffect(() => {
        LowTime()
        getBalancStaker()
    }, [web3States.getBalancesStake,web3States.getTimeleft])



    return (<>
        <Navbar className='class-div fs-6 ' style={{ "backgroundColor": "rgb(219, 221, 223)" }}>
            <Container>
                <Nav.Link >
                    <Connect/>
                    <Button variant="outline-dark" className="ms-2">
                    مقدار اتر قفل شده : {web3States.getBalancesStake}
                    </Button>

                </Nav.Link>

                <Nav.Link>
                </Nav.Link>
                <Nav.Link>
                    <Button variant="outline-dark" >
                      {secondtime} : زمان باقی مانده 
                    </Button>
                </Nav.Link>

            </Container>
        </Navbar>

    </>);
}

export default NavbarComponent