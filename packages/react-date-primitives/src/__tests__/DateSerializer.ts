import { toISODateString } from '../utils';

const serializer: jest.SnapshotSerializerPlugin = {
  print: (val: unknown) => toISODateString(val as Date),
  test(val: unknown): val is Date {
    return val instanceof Date;
  }
};

export default serializer;
