import { Schema, model } from "mongoose";
import { IAndroidAppImage } from "../../interface/androidApp/androidApp.interface";

//#region Schema and Model
const androidAppImageSchema = new Schema<IAndroidAppImage>({
    appId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    role: {
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
          ret.url = `/assets/images/${ret.filename}`;
          delete ret.appId;
          delete ret._id;
          delete ret.__v;
          delete ret.filename;
          delete ret.id;
        },
        versionKey: false // This removes __v
      }
})

export const AndroidAppImageModel = model<IAndroidAppImage>("AndroidAppImage", androidAppImageSchema);
//#endregion
