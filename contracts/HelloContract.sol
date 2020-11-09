//SPDX-License-Identifier: MIT
pragma solidity >= 0.6.0 < 0.8.0;

contract HelloContract {
	uint256 public locked = 0;

	function Lock(uint256 amount) external {
		locked += amount;
	}

	function Unlock(uint256 amount) external {
		locked -= amount;
	}
}
