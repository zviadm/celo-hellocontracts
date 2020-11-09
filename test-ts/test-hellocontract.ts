const HelloContract = artifacts.require("HelloContract");

contract('HelloContract', (accounts) => {
	it(`example test`, async () => {
		const instance = await HelloContract.deployed()
		let locked = await instance.locked()
		assert.equal(locked.toNumber(), 0)
		await instance.Lock(15)
		locked = await instance.locked()
		assert.equal(locked.toNumber(), 15)
		await instance.Unlock(5)
		locked = await instance.locked()
		assert.equal(locked.toNumber(), 10)
	})
})