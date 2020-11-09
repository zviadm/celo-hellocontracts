const HelloContract = artifacts.require("HelloContract");

module.exports = function (deployer) {
	deployer.deploy(HelloContract);
} as Truffle.Migration;
