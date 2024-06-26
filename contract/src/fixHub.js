// @ts-check
import { E, Far } from '@endo/far';

const { Fail } = assert;

/**
 * ref https://github.com/Agoric/agoric-sdk/issues/8408#issuecomment-1741445458
 *
 * @param {ERef<import('@agoric/vats').NameAdmin>} namesByAddressAdmin
 */
export const fixHub = async namesByAddressAdmin => {
  /** @type {import('@agoric/vats').NameHub} */
  const hub = Far('Hub work-around', {
    lookup: async (addr, ...rest) => {
      console.group('---------- inside fixHub----------');
      console.log('------------------------');
      console.log('this Value ::::::', this);
      console.log('------------------------');
      console.log(' addr && rest ::::::', { addr, rest });
      console.log('------------------------');
      console.groupEnd();
      await E(namesByAddressAdmin).reserve(addr);
      const addressAdmin = await E(namesByAddressAdmin).lookupAdmin(addr);
      assert(addressAdmin, 'no admin???');
      const addressHub = E(addressAdmin).readonly();
      if (rest.length === 0) return addressHub;
      await E(addressAdmin).reserve(rest[0]);
      return E(addressHub).lookup(...rest);
    },
    has: _key => Fail`key space not well defined`,
    entries: () => Fail`enumeration not supported`,
    values: () => Fail`enumeration not supported`,
    keys: () => Fail`enumeration not supported`,
  });
  return hub;
};
