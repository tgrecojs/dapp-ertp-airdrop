// @ts-check
import { E } from '@endo/far';
import { AmountMath, AssetKind } from '@agoric/ertp';
import { createRequire } from 'module';
import { test as anyTest } from './airdropData/prepare-test-env-ava.js';
import {
  bootAndInstallBundles,
  getBundleId,
  makeBundleCacheContext,
} from './boot-tools.js';
import {
  installContractStarter,
  startContractStarter,
} from '../src/start-contractStarter.js';
import { mockWalletFactory } from './wallet-tools.js';
import { receiverRose, senderContract, starterSam } from './market-actors.js';
import { documentStorageSchema } from './airdropData/storageDoc.js';
import { makeClientMarshaller } from '../src/marshalTables.js';
import { makeStableFaucet } from './power-tools/mintStable.js';

/** @typedef {import('../src/start-contractStarter.js').ContractStarterPowers} ContractStarterPowers */

const myRequire = createRequire(import.meta.url);

const assets = {
  contractStarter: myRequire.resolve('../src/contractStarter.js'),
  postalSvc: myRequire.resolve('../src/postalSvc.js'),
  airdropCampaign: myRequire.resolve('../src/airdropCampaign.js'),
};

/** @type {import('ava').TestFn<Awaited<ReturnType<makeBundleCacheContext>>>} */
const test = anyTest;

test.before(async t => (t.context = await makeBundleCacheContext(t)));

test('use contractStarter to start postalSvc', async t => {
  const {
    powers: powers0,
    bundles,
    boardAux,
  } = await bootAndInstallBundles(t, assets);

  console.log({ boardAux });
  const id = {
    airdropCampaign: { bundleID: getBundleId(bundles.airdropCampaign) },
    contractStarter: { bundleID: getBundleId(bundles.contractStarter) },
    postalSvc: { bundleID: getBundleId(bundles.postalSvc) },
  };
  console.log('ids ####', { id });
  /** @type { typeof powers0 & ContractStarterPowers} */
  // @ts-expect-error bootstrap powers evolve with BLD staker governance
  const powers = powers0;

  await installContractStarter(powers, {
    options: { contractStarter: id.contractStarter },
  });
  await startContractStarter(powers, {});

  const brand = {
    Invitation: await powers.brand.consume.Invitation,
  };

  /**
   * @type {import('./market-actors.js').WellKnown &
   *  import('./market-actors.js').WellKnownKinds &
   *  import('./market-actors.js').BoardAux}
   */
  const wellKnown = {
    installation: powers.installation.consume,
    instance: powers.instance.consume,
    issuer: powers.issuer.consume,
    brand: powers.brand.consume,
    assetKind: new Map(
      /** @type {[Brand, AssetKind][]} */ ([[brand.Invitation, AssetKind.SET]]),
    ),
    boardAux,
  };

  const { zoe, namesByAddressAdmin, chainStorage, feeMintAccess } =
    powers.consume;
  const walletFactory = mockWalletFactory(
    { zoe, namesByAddressAdmin, chainStorage },
    {
      Invitation: await wellKnown.issuer.Invitation,
      IST: wellKnown.issuer.IST,
    },
  );

  const shared = { destAddr: 'agoric1receiverRoseStart' };
  const wallet = {
    sam: await walletFactory.makeSmartWallet('agoric1senderSamStart'),
    rose: await walletFactory.makeSmartWallet(shared.destAddr),
  };
  const { bundleCache } = t.context;
  const { mintBrandedPayment } = makeStableFaucet({
    bundleCache,
    feeMintAccess,
    zoe,
  });

  await E(wallet.sam.deposit).receive(
    await mintBrandedPayment(100n * 1_000_000n),
  );

  const installation = await starterSam(
    t,
    { wallet: wallet.sam },
    wellKnown,
  ).then(sam =>
    E(sam).install({
      bundleID: id.airdropCampaign.bundleID,
      label: 'airdropCampaign',
    }),
  );

  t.log('installation ###', installation);
  const toSend = { ToDoEmpty: AmountMath.make(brand.Invitation, harden([])) };
  const sam = starterSam(t, { wallet: wallet.sam, ...id.postalSvc }, wellKnown);
  await Promise.all([
    E(installation)
      .getPostalSvcTerms()
      .then(customTerms => {
        console.log('AFTER startSam ::::', { customTerms });

        return E(sam)
          .installAndStart({
            instanceLabel: 'postalSvc',
            ...id.postalSvc,
            customTerms,
          })
          .then(({ instance: postalSvc }) => {
            const terms = { postalSvc, destAddr: shared.destAddr };
            senderContract(t, { zoe, terms });
          });
      }),
    receiverRose(t, { wallet: wallet.rose }, wellKnown, { toSend }),
  ]);

  const m = makeClientMarshaller();
  const storage = await powers.consume.chainStorage;
  const note = `Terms of contractStarter and the contracts it starts are published under boardAux`;
  await documentStorageSchema(t, storage, { note, marshaller: m });
});
