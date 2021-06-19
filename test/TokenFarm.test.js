const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm= artifacts.require('TokenFarm')

require('chai')
.use(require('chai-as-promised'))
.should()

function tokens(n){
	return web3.utils.toWei(n,'ether');
}

contract('TokenFarm',([owner,investor]) =>{
	let daiToken,dappToken,tokenFarm

before(async () => {

	//Load contracts

	daiToken = await DaiToken.new()
	dappToken = await DappToken.new()
	tokenFarm = await TokenFarm.new(DappToken.address , daiToken.address)

	//Transfer all Dapp Tokens
	await dappToken.transfer(tokenFarm.address,tokens('1000000'))

	await daiToken.transfer(investor, tokens('100'),{ from:owner} )
})


describe('Mock DAI deployment',async ()=> {
	it('has a name',async() => {
	let daiToken = await DaiToken.new()
	const name = await daiToken.name()
	assert.equal(name,'Mock DAI Token')
} )
})


describe('Dapp deployment',async ()=> {
	it('has a name',async() => {
	let dappToken = await DappToken.new()
	const name = await dappToken.name()
	assert.equal(name,'DApp Token')
} )
})

describe('Token Farm deployment',async ()=> {
	it('has a name',async() => {
	
	const name = await tokenFarm.name()
	assert.equal(name,'DApp Token Farm')
} )
	it('contract has tokens',async()=>{
		let balance= await dappToken.balanceOf(tokenFarm.address)
		assert.equal(balance.toString() ,tokens('1000000'))
	})
})

describe('Farming tokens',async()=>{
	it('rewards investors for staking mDai tokens',async ()=>{
		let result
		//check investor balance for staking
		result = await daiToken.balanceOf(investor)
		assert.equal(result.toString(),tokens('100'),'investor Mock DAI wallet balance correct before staking')
	

	await daiToken.approve(tokenFarm.address , tokens('100'),{from : investor})
	await tokenFarm.stakeTokens(tokens('100'),{from : investor})

	result = await daiToken.balanceOf(investor)
	assert.equal(result.toString(),tokens('0') , 'investor Mock Dai wallet balance correct after staking')


	result = await tokenFarm.stakingBalance(investor)
	assert.equal(result.toString(),tokens('100') , 'investor staking balance correct after staking')

	result = await tokenFarm.isStaking(investor)
	assert.equal(result.toString(),'true', 'investor staking status correct after staking')

      	await tokenFarm.issueTokens({ from: owner })


      // Unstake tokens
      	await tokenFarm.unstakeTokens({ from: investor })

      // Check results after unstaking
      	result = await daiToken.balanceOf(investor)
      	assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')

      
      	result = await tokenFarm.stakingBalance(investor)
     	assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

      	result = await tokenFarm.isStaking(investor)
      	assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
	


	})

    })
})
