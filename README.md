# celo-hellocontracts

Example smart contract that integrates with the Celo core contracts. Comes with an end-2-end test too, to demonstrate
how to write tests utilizing @celo/contractkit for more complex interactions.

HelloContract implements the following:
* Allows any user to lock CELO through this contract.
* Allows any other user to unlock and withdraw locked CELO held through this contract.

It isn’t a very practical or useful smart contract, but it demonstrates how to integrate with the core Celo contracts and how to write complex tests for it.

## Testing

Before running migrations or tests, you need to start ganache:
```
> npm run ganache
```

Run tests:
```
> npm test
```

## Structure

As described in Truffle documentation: https://www.trufflesuite.com/docs/truffle/testing/testing-your-contracts,
Truffle provides clean-room environment for each separate test file. However, this clean-room environment only applies
to contracts that you write and deploy using Truffle. State of the Celo core contracts won't be reset between runs.

We recommend these practices to keep your tests self-contained:
* Treat each test file as a single large test. Do not put unrelated tests in the same file.
* Tests within a file run in the order of definition, and it's ok to depend on this order since
we are treating each file as a single large test.
* Configure Truffle to run with --bail option to fail the whole file when one test fails.
* In each test file, create new accounts to use for testing using `web3.eth.personal` APIs, instead of
using the supplied `accounts` directly. This will make it easier to avoid any core contract state conflicts
between test runs.
```
const addr = await web3.eth.personal.newAccount("")
await web3.eth.personal.unlockAccount(addr, "", 0)
```

