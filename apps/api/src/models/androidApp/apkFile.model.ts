import { Schema, model } from "mongoose";
import { IAndroidAppApk } from "../../interface/androidApp/androidApp.interface";

//#region Schema and Model
const androidAppApkSchema = new Schema<IAndroidAppApk>({
    appId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: false,
    },
    dateUpdated: {
        type: Date,
        required: false,
    }
  }, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
          ret.id = ret._id;
          delete ret._id;
          delete ret.__v;
        },
        versionKey: false // This removes __v
      }
})

export const AndroidAppApkModel = model<IAndroidAppApk>("AndroidAppApk", androidAppApkSchema)
//#endregion
