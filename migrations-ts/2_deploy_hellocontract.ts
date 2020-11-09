const HelloContract = artifacts.require("HelloContract");

module.exports = function (deployer, network) {
	if (network !== "development") {
		throw new Error("unsupported network!")
	}
	const contracts = {
		"development": {
			Accounts: "0xd3771D58F901C5d50b093501f38659016863Eb6C",
			GoldToken: "0x4D3d5c850Dd5bD9D6F4AdDA3DD039a3C8054CA29",
			LockedGold: "0x54102fA75B2446837b2c7472d4b533366eCd2811",
		},
	}
	deployer.deploy(
		HelloContract,
		contracts[network].Accounts,
		contracts[network].GoldToken,
		contracts[network].LockedGold);
} as Truffle.Migration;

export {}