import {model, Schema} from "mongoose";
import {IAppReview} from "../../interface/androidApp/androidApp.interface";

const appReviewSchema = new Schema<IAppReview>({
  appId: {
    type: Schema.Types.ObjectId,
    ref: 'AndroidApp',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});


export const AppReviewModel = model<IAppReview>("AndroidAppReview", appReviewSchema)
