# Snapshot report for `test/test-launchAirdrop.js`

The actual snapshot is saved in `test-launchAirdrop.js.snap`.

Generated by [AVA](https://avajs.dev).

## start launchIt instance to launch token

> boardAux for launchIt, contractStarter instances
> The example below illustrates the schema of the data published there.
> 
> See also board marshalling conventions (_to appear_).

    [
      [
        'published.boardAux.board0188',
        {
          label: 'memecoinAirdrop-launch',
          terms: {
            brands: {
              Airdroplets: Object @Alleged: Airdroplets brand#board0639 {},
              Deposit: Object @Alleged: Airdroplets brand#board0639 {},
            },
            claimWindowLength: 241920000n,
            deadline: {
              absValue: 10n,
              timerBrand: Object @Alleged: timerBrand#board02810 {},
            },
            emptyPurse: Object @Alleged: Airdroplets Purse purse#board05311 {},
            issuers: {
              Airdroplets: Object @Alleged: Airdroplets issuer#board04312 {},
              Deposit: Object @Alleged: Airdroplets issuer#board04312 {},
            },
            name: 'memecoinAirdrop',
            rootHash: 'fs2defffdd8s88usd',
          },
        },
      ],
      [
        'published.boardAux.board0371',
        {
          label: 'contractStarter',
          terms: {
            agoricNames: Object @Alleged: NameHubKit nameHub#board0592 {},
            brands: {
              Fee: Object @Alleged: ZDEFAULT brand#board0223 {},
              Invitation: Object @Alleged: Zoe Invitation brand#board0074 {},
            },
            issuers: {
              Fee: Object @Alleged: ZDEFAULT issuer#board0425 {},
              Invitation: Object @Alleged: Zoe Invitation issuer#board0566 {},
            },
            namesByAddress: Object @Alleged: Hub work-around#board0257 {},
            prices: {
              board: {
                brand: Object @Alleged: ZDEFAULT brand#board0223 {},
                value: 2000000n,
              },
              installBundleID: {
                brand: Object @Alleged: ZDEFAULT brand#board0223 {},
                value: 2000000n,
              },
              priceAuthority: {
                brand: Object @Alleged: ZDEFAULT brand#board0223 {},
                value: 2000000n,
              },
              startInstance: {
                brand: Object @Alleged: ZDEFAULT brand#board0223 {},
                value: 10000000n,
              },
              storageNode: {
                brand: Object @Alleged: ZDEFAULT brand#board0223 {},
                value: 5000000n,
              },
              timerService: {
                brand: Object @Alleged: ZDEFAULT brand#board0223 {},
                value: 4000000n,
              },
            },
          },
        },
      ],
    ]
