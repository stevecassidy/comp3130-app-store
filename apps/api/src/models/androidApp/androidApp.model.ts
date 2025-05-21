import { Schema, model } from "mongoose";
import { IAndroidApp } from "../../interface/androidApp/androidApp.interface";

//#region Schema and Model
const androidAppSchema = new Schema<IAndroidApp>({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    dataSafety: {
        type: Object,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: false,
    },
    dateUpdated: {
        type: Date,
        required: false,
    },
    repoLink: {
        type: String,
        required: false,
    }
  }, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
          ret.id = ret._id;
          delete ret._id;
          delete ret.__v;
        },
        versionKey: false // This removes __v
      }
    })

androidAppSchema.virtual('apkFiles', {
    ref: 'AndroidAppApk',
    localField: '_id',
    foreignField: 'appId',
});

androidAppSchema.virtual('images', {
    ref: 'AndroidAppImage',
    localField: '_id',
    foreignField: 'appId',
});

const AndroidAppModel = model<IAndroidApp>("AndroidApp", androidAppSchema)


//#endregion

export { AndroidAppModel }
