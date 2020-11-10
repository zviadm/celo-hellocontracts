# celo-hellocontracts

Example smart contract that integrates with the Celo core contracts. Comes with an end-2-end test too, to demonstrate
how to write tests utilizing @celo/contractkit for more complex interactions.

HelloContract implements following:
* Allows any user to lock CELO through this contract.
* Allows any other user to unlock and withdraw locked CELO held through this contract.

It isn’t a very practical or useful smart contract, but it demonstrates how to integrate with the core Celo contracts and how to write complex tests for it.

## Testing

Before running migrations or tests, you need to start ganache:
```
> npm run ganache
```

Run migrations and run tests:
```
> npm run migrate
> npm test
```
