pragma solidity ^0.5.0;
import "./DappToken.sol";
import "./DaiToken.sol";



contract TokenFarm{
	

	string public name = "DApp Token Farm"; 
    
    	address[] public stakers;
	mapping(address => uint256)public stakingBalance;
	mapping(address => bool)public hasStaked;
	mapping(address => bool)public isStaking;
	mapping(address =>uint256) public timeOfStaked;


	DappToken public dappToken;
	DaiToken public daiToken;
	address public owner;

	constructor(DappToken _dappToken , DaiToken _daiToken) public{
	
	dappToken=_dappToken;
	daiToken= _daiToken;
	owner = msg.sender;

	}
// 1. Stake Tokens(deposit)

function stakeTokens(uint256 _amount) public
{
	

	require(_amount > 0,"amount cannout be 0");

	//Transfer dai tokens to this contract for staking

	daiToken.transferFrom(msg.sender,address(this),_amount);
	timeOfStaked[msg.sender]=now;

        //Update staking balance
	stakingBalance[msg.sender] = stakingBalance[msg.sender] +_amount;

	//add users to stakers array 

	if(!hasStaked[msg.sender])
	{
		stakers.push(msg.sender);
	}
	
	isStaking[msg.sender]=true;
	hasStaked[msg.sender]=true;

}


       // 2.Unstake All the Tokens(Withdraw) 
	function unstakeTokens() public
	{
		uint256 balance = stakingBalance[msg.sender];
		require((balance > 0),"staking balance cannt be 0");
		daiToken.transfer(msg.sender,balance);
		stakingBalance[msg.sender]=0;
		isStaking[msg.sender] = false;
	}


       // 3.Issuing Tokens

	function issueTokens() public
	{

	require(msg.sender == owner,"calller must be the owner");
	
		uint256 nbalance; 
	
		
		uint256 balance = stakingBalance[msg.sender]; // fetching the current wallet balance of the user .
		if(balance > 0)
		{
		if(balance >0 && balance <=1000)
		
		{
			nbalance = balance + ((balance*4) / 100 ) * ((now/31556926)-(timeOfStaked[msg.sender] /31556926)); // calculating the years of vesting period
		}
		else if(balance > 1000 && balance <=2000) 
		{
			nbalance = balance + ((balance * 8)/100) * ((now/31556926)-(timeOfStaked[msg.sender]/31556926));	
		}
		else if(balance > 2000)
		{
			nbalance = balance + ((balance * 10) / 100) *((now/31556926)-(timeOfStaked[msg.sender] /31556926)); 
		}
		
		dappToken.transfer(msg.sender,nbalance); // Reward transferring...
		
     		}
   }

}
