// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/** 
 * Enter the lottery ,(paying fees)
 * Pick random winner (chainLink VRF, transparent and verifiable )
 * Slection process autamated;
 * ChainLink Oracle -> randomness, automation --> ChainLink Keeper;
 * 
*/

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";
import "hardhat/console.sol";

/** error */
error Raffle__notEnoughFunds();


contract Raffle is VRFConsumerBaseV2{
    //State variable 
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator; 
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS =  3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;

    //local 
    address  private s_recentWinner;


    /*Events */
    event RaffleEnter (address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event winnerPicked (address indexed winner);


    constructor (address vrfCoodinatorV2,uint256 entranceFee,uint256 interval, bytes32 gasLane,uint64 subscriptionId, uint32 callbackGasLimit)
     VRFConsumerBaseV2(vrfCoodinatorV2){
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator); 
        i_gasLane = gasLane; 
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;


    }

    function checkQualification () {
        if (msg.value < i_entranceFee)  {
            revert Raffle__notEnoughFunds();
        }
        s_players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }
    

    function pickRandomWinner () external {
        //request the random num
        //pick winner
        //execute 
        //VRF 2 transaction process
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS

        );
        emit RequestedRaffleWinner(requestId);
        /**
         * i_gasLane
         * uint32 callbackGasLimit
         * requestConfirmations,
         *  numWords
         */
        
    }
    function fullFillRandomWords(uint256 requestId,uint256[] memory randomWords) internal Override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        // require(success, "Transfer failed");
        if (!success) {
            revert Raffle__TransferFailed();
        }
        emit WinnerPicked(recentWinner);
     }
    /* view pure functions*/

    function getWinner() public view returns(address) {
        return s_players[index]; 
    }

    function getEntranceFee(uint256) public view returns(uint256) {
        return i_entranceFee;
    }

    function getRecentWinner() public view returns(address) {
        return s_recentWinner;
    }

    
         
   
}