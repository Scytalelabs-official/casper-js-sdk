import { expect } from 'chai';
import { CLURef, AccessRights } from './index';
import { decodeBase16 } from '../../index';

const urefAddr =
  '2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a';
const RWExampleURef = new CLURef(
  decodeBase16(urefAddr),
  AccessRights.READ_ADD_WRITE
);

const formattedStr =
  'uref-ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff-007';

describe('CLUref', () => {
  it('Should be valid by construction', () => {
    const badFn1 = () =>
      new CLURef(decodeBase16('3a3a3a'), AccessRights.READ_ADD_WRITE);
    const badFn2 = () => new CLURef(decodeBase16(urefAddr), 10);

    expect(RWExampleURef).to.be.an.instanceof(CLURef);
    expect(badFn1).to.throw('The length of URefAddr should be 32');
    expect(badFn2).to.throw('Unsuported AccessRights');
  });

  it('Should return proper clType()', () => {
    expect(RWExampleURef.clType().toString()).to.be.eq('URef');
  });

  it('Should return proper value()', () => {
    expect(RWExampleURef.value()).to.be.deep.eq({
      data: decodeBase16(urefAddr),
      accessRights: AccessRights.READ_ADD_WRITE
    });
  });

  it('fromFormattedStr() / toFormattedStr() proper value', () => {
    const myURef = CLURef.fromFormattedStr(formattedStr);
    const badFn1 = () => CLURef.fromFormattedStr('xxxx-ttttttttttttttt-000');
    const badFn2 = () => CLURef.fromFormattedStr('uref-ttttttttttttttt');

    expect(myURef).to.be.an.instanceof(CLURef);
    expect(myURef.toFormattedStr()).to.be.eq(formattedStr);
    expect(badFn1).to.throw("Prefix is not 'uref-");
    expect(badFn2).to.throw('No access rights as suffix');
  });

  it('toBytes() proper values', () => {
    // prettier-ignore
    const expectedBytes = Uint8Array.from([...Array(32).fill(42), 7]);
    expect(RWExampleURef.toBytes()).to.be.deep.eq(expectedBytes);
  });
});
