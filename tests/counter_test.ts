
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.31.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Ensure that <...>",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let block = chain.mineBlock([
            /* 
             * Add transactions with: 
             * Tx.contractCall(...)
            */
        ]);
        assertEquals(block.receipts.length, 0);
        assertEquals(block.height, 2);

        block = chain.mineBlock([
            /* 
             * Add transactions with: 
             * Tx.contractCall(...)
            */
        ]);
        assertEquals(block.receipts.length, 0);
        assertEquals(block.height, 3);
    },
});

Clarinet.test({
    name: "Check get-count returns u0",
    async fn (chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get("deployer")!;

        // 1. name of contract
        // 2. name of function
        // 3. any args for function
        // 4. address of principal calling
        let count = chain.callReadOnlyFn("counter", "get-count", [], deployer.address)

        count.result.expectUint(0);
    }
});

Clarinet.test({
    name: "Check that get-count returns u1 when increme,nt is called",
    async fn(chain: Chain, accounts: Map<string,Account>) {
        let deployer = accounts.get("deployer")!;

        // function to create a block
        let block = chain.mineBlock([
            Tx.contractCall("counter", "increment", [], deployer.address)
        ])
        // retreive result of that call
        let [receipt] = block.receipts; 
        // get validation
        receipt.result.expectOk().expectBool(true);
        // check new state of smart contract
        let count = chain.callReadOnlyFn("counter", "get-count", [], deployer.address);
        
        count.result.expectUint(1)
    }
})

Clarinet.test({
    name: "Check that get-count returns u1 when decrement is called with initial state of u2",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get("deployer")!;

        // function to create a block
        let block = chain.mineBlock([
            Tx.contractCall("counter", "increment", [], deployer.address),
            Tx.contractCall("counter", "increment", [], deployer.address),
        ])

        //let [receipt] = block.receipts; 
        
        //receipt.result.expectOk().expectBool(true);
        
        let count = chain.callReadOnlyFn("counter", "get-count", [], deployer.address);
        
        count.result.expectUint(2)

        let second_block = chain.mineBlock([
            Tx.contractCall("counter", "decrement", [], deployer.address)
        ])

        let [receipt] = block.receipts;

        receipt.result.expectOk().expectBool(true);

        let second_count = chain.callReadOnlyFn("counter", "get-count", [], deployer.address);

        second_count.result.expectUint(1);
    }

});

// new public function to allow user input for count setting
Clarinet.test({
    name: "test that set-count function with arg of u5 changes count to u5",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        
        let first_count = chain.callReadOnlyFn("counter", "get-count", [], deployer.address);

        first_count.result.expectUint(0);
        
        let block = chain.mineBlock([
            Tx.contractCall("counter", "set-count", [types.uint(5)], deployer.address)
        ])

        let [receipt] = block.receipts;

        receipt.result.expectOk().expectBool(true);

        let second_count = chain.callReadOnlyFn("counter", "get-count", [], deployer.address);

        second_count.result.expectUint(5);
    }
})