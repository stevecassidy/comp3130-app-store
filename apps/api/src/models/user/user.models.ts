//#region Import
import { model, Schema } from "mongoose";
import { IUser } from "../../interface/user/user.interface";
//#endregion

//#region Schema and Model
const userSchema = new Schema<IUser>({
	email: { type: String, required: true },
	password: { type: String, required: true },
	role: { type: String, required: false },
	salt: { type: String },
	name: { type: String, required: true },
},{
	toJSON: {
		transform: function(doc, ret) {
          ret.id = ret._id;
					ret.role = ret.role || 'user';
          delete ret._id;
          delete ret.__v;
					delete ret.password;
					delete ret.salt;
        },
	}
});

// reviews by this user
userSchema.virtual('reviews', {
    ref: 'AndroidAppReview',
    localField: '_id',
    foreignField: 'userId',
});

const UserModel = model<IUser>("User", userSchema);
//#endregion

export { UserModel };
