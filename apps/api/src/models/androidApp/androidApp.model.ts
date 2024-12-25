import { Schema, model } from "mongoose";
import { IAndroidApp } from "../../interface/androidApp/androidApp.interface";

//#region Schema and Model
const androidAppSchema = new Schema<IAndroidApp>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
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

const AndroidAppModel = model<IAndroidApp>("AndroidApp", androidAppSchema)
//#endregion

export { AndroidAppModel }
