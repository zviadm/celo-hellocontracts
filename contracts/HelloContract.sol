//SPDX-License-Identifier: MIT
pragma solidity >= 0.6.0 < 0.8.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IAccounts.sol";
import "./interfaces/ILockedGold.sol";

contract HelloContract {
	using SafeMath for uint256;

	IERC20 public _GoldToken;
	ILockedGold public _LockedGold;

	constructor (
		address Accounts,
		address GoldToken,
		address LockedGold
	) public {
		_GoldToken = IERC20(GoldToken);
		_LockedGold = ILockedGold(LockedGold);
		require(
			IAccounts(Accounts).createAccount(),
			"createAccount failed");
	}

	function Lock(uint256 amount) external {
		require(
			_GoldToken.transferFrom(msg.sender, address(this), amount),
			"transfer of CELO failed");
		_LockedGold.lock.value(amount)();
	}

	function Unlock(uint256 amount) external {
		_LockedGold.unlock(amount);
	}

	function Withdraw(uint256 idx) external {
  		(uint256[] memory values, uint256[] memory timestamps) = _LockedGold.getPendingWithdrawals(address(this));
		_LockedGold.withdraw(idx);
    	bool success = _GoldToken.transfer(msg.sender, values[idx]);
    	assert(success);
  	}

	receive() external payable {}
}
