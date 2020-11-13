import { newKit } from "@celo/contractkit"
import { Provider, increaseTime } from "celo-devchain"
import { toWei } from "web3-utils"

const HelloContract = artifacts.require("HelloContract");

const kit = newKit("http://127.0.0.1:7545")
after(() => { kit.stop() })
contract('HelloContract', (accounts) => {
	const source = accounts[0]
	let a0: string
	let a1: string
	let a2: string

	it(`create accounts`, async () => {
		const goldToken = await kit.contracts.getGoldToken()
		a0 = await web3.eth.personal.newAccount("")
		await web3.eth.personal.unlockAccount(a0, "", 0)
		a1 = await web3.eth.personal.newAccount("")
		await web3.eth.personal.unlockAccount(a1, "", 0)
		a2 = await web3.eth.personal.newAccount("")
		await web3.eth.personal.unlockAccount(a2, "", 0)

		await goldToken
			.transfer(a0, toWei('10.5', 'ether'))
			.sendAndWaitForReceipt({from: source} as any)
		await goldToken
			.transfer(a1, toWei('0.5', 'ether'))
			.sendAndWaitForReceipt({from: source} as any)
		await goldToken
			.transfer(a2, toWei('0.5', 'ether'))
			.sendAndWaitForReceipt({from: source} as any)
	})

	it(`locking`, async () => {
		const goldToken = await kit.contracts.getGoldToken()
		const helloContract = await HelloContract.deployed()

		// Allow HelloContract to transfer 10 CELO from `a0`, and call Lock function on it.
		await goldToken
			.increaseAllowance(helloContract.address, toWei('10', 'ether'))
			.sendAndWaitForReceipt({from: a0} as any)
		await helloContract.Lock(toWei('10', 'ether'), {from: a0})

		const balanceA0 = await goldToken.balanceOf(a0)
		assert.isTrue(balanceA0.lt(toWei('0.5', 'ether')), `balance a0: ${balanceA0}`)
	})

	it (`unlocking`, async () => {
		const goldToken = await kit.contracts.getGoldToken()
		const lockedGold = await kit.contracts.getLockedGold()
		const helloContract = await HelloContract.deployed()

		// Anyone can call Unlock.
		await helloContract.Unlock(toWei('3', 'ether'), {from: a1})
		await helloContract.Unlock(toWei('7', 'ether'), {from: a2})

		const pendings = await lockedGold.getPendingWithdrawals(helloContract.address)
		assert.lengthOf(pendings, 2)
		assert.isTrue(pendings[0].value.eq(toWei('3', 'ether')))
		assert.isTrue(pendings[1].value.eq(toWei('7', 'ether')))

		// Make sure unlock period passes.
		await increaseTime(kit.web3.currentProvider as Provider, 3 * 24 * 3600 + 1)

		// Anyone can withdraw anything..., `a1` gets +7 CELO, `a2` gets +3 CELO.
		await helloContract.Withdraw(1, {from: a1})
		await helloContract.Withdraw(0, {from: a2})

		const contractCELO = await goldToken.balanceOf(helloContract.address)
		const contractLockedCELO = await lockedGold.getAccountTotalLockedGold(helloContract.address)
		assert.equal(contractCELO.toNumber(), 0)
		assert.equal(contractLockedCELO.toNumber(), 0)

		const balanceA1 = await goldToken.balanceOf(a1)
		const balanceA2 = await goldToken.balanceOf(a2)
		assert.isTrue(balanceA1.gt(toWei('7', 'ether')), `balance a1: ${balanceA1}`)
		assert.isTrue(balanceA2.gt(toWei('3', 'ether')), `balance a2: ${balanceA2}`)
	})
})

export {}
