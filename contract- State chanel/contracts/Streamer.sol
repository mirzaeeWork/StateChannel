// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Verifier.sol";

contract Streamer is Ownable, Verifier {
    event Opened(address, uint256);
    event Challenged(address);
    event Withdrawn(address, uint256);
    event Closed(address);

    mapping(address => uint256) public balances;
    mapping(address => uint256) public canCloseAt;

    function getBalances() public view returns (uint256) {
        return balances[msg.sender];
    }

    function getCanCloseAt() public view returns (uint256) {
        return canCloseAt[msg.sender];
    }

    function fundChannel() public payable {
        /*
        Checkpoint 3: fund a channel

        complete this function so that it:
        - reverts if msg.sender already has a running channel (ie, if balances[msg.sender] != 0)
        - updates the balances mapping with the eth received in the function call
        - emits an Opened event
        */
        if (balances[msg.sender] != 0) {
            revert("Streamer : msg.sender already has a running channel");
        }
        require(
            msg.value > 0,
            "Streamer : The amount of ether is greater than zero"
        );
        balances[msg.sender] = msg.value;
        canCloseAt[msg.sender] = block.timestamp + 2 days;
        // 3 minutes;
        emit Opened(msg.sender, msg.value);
    }

    function timeLeft(address channel) public view returns (uint256) {
        require(canCloseAt[channel] != 0, "channel is not closing");
        if (block.timestamp > canCloseAt[channel]) {
            return 0;
        } else {
            return canCloseAt[channel] - block.timestamp;
        }
    }

    function uintToString(
        uint256 updatedBalance
    ) public pure returns (string memory str) {
        uint256 maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint256 i = 0;
        while (updatedBalance != 0) {
            uint256 remainder = updatedBalance % 10;
            updatedBalance = updatedBalance / 10;
            reversed[i++] = bytes1(uint8(48 + remainder));
        }
        bytes memory s = new bytes(i);
        for (uint256 j = 0; j < i; j++) {
            s[j] = reversed[i - 1 - j];
        }
        str = string(s);
    }

    function withdrawEarnings(
        uint256 updatedBalance,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        string memory _updatedBalance = uintToString(updatedBalance);
        address signer = verifyString(_updatedBalance, v, r, s);
        require( 
            timeLeft(msg.sender) > 0,
            "executeTransaction : Time is over"
        );
        require(
            balances[signer] > updatedBalance,
            "Streamer : Insufficient inventory"
        );
        uint256 _balance = balances[signer] - updatedBalance;
        balances[signer] = _balance;
        uint256 paymentToOwner = (updatedBalance * 3) / 10;
        uint256 paymentToSigner = updatedBalance - paymentToOwner;
        (bool success, ) = payable(owner()).call{value: paymentToOwner }("");
        require(success, "executeTransaction: tx failed");
        (bool _success, ) = payable(signer).call{value: paymentToSigner }("");
        require(_success, "executeTransaction: tx failed");

        emit Withdrawn(signer, updatedBalance);
    }

    /*
    Checkpoint 6a: Challenge the channel

    create a public challengeChannel() function that:
    - checks that msg.sender has an open channel
    - updates canCloseAt[msg.sender] to some future time
    - emits a Challenged event
    */
    function challengeChannel(uint256 _time) public {
        require(
            balances[msg.sender] != 0,
            "executeTransaction : that msg.sender has not an open channel"
        );
        canCloseAt[msg.sender] = block.timestamp + _time;
        emit Challenged(msg.sender);
    }

    /*
    Checkpoint 6b: Close the channel

    create a public defundChannel() function that:
    - checks that msg.sender has a closing channel
    - checks that the current time is later than the closing time
    - sends the channel's remaining funds to msg.sender, and sets the balance to 0
    - emits the Closed event
    */
    function defundChannel() public {
        require(
            canCloseAt[msg.sender] != 0,
            "executeTransaction : The channel has not expired"
        );
        require(
            timeLeft(msg.sender) == 0,
            "executeTransaction : Time is not over"
        );
        canCloseAt[msg.sender]=0; 
        uint256 pay = balances[msg.sender];
        balances[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: pay}("");
        require(success, "executeTransaction: tx failed");
        emit Closed(msg.sender);
    }
}
