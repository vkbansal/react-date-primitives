import { toISODateString } from '../utils';

const serializer: jest.SnapshotSerializerPlugin = {
    print: toISODateString,
    test(val): boolean {
        return val instanceof Date;
    }
};

export default serializer;
