import { Schema } from 'mongoose';
let Mixed = Schema.Types.Mixed;

export let StatRecordsMongoDbSchema = function(collection?: string) {
    collection = collection || 'statistics';

    let schema = new Schema(
        {
            _id: { type: String, unique: true },
            group: { type: String, required: true, index: true },
            name: { type: String, required: true },
            type: { type: Number, required: true },
            year: { type: Number, required: false },
            month: { type: Number, required: false, min: 1, max: 12 },
            day: { type: Number, required: false, min: 1, max: 31 },
            hour: { type: Number, required: false, min: 0, max: 24 },
            value: { type: Number, required: true }
        },
        {
            collection: collection,
            autoIndex: true,
            strict: true
        }
    );

    schema.set('toJSON', {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    return schema;
}
