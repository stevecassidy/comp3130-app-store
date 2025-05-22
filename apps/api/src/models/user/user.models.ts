//#region Import
import { model, Schema } from "mongoose";
import { IUser } from "../../interface/user/user.interface";
//#endregion

//#region Schema and Model
const userSchema = new Schema<IUser>({
	email: { type: String, required: true },
	password: { type: String, required: true },
	salt: { type: String },
	name: { type: String, required: true },
},{
	toJSON: {
		transform: function(doc, ret) {
          ret.id = ret._id;
          delete ret._id;
          delete ret.__v;
					delete ret.password;
					delete ret.salt;
        },
	}
});

const UserModel = model<IUser>("User", userSchema);
//#endregion

export { UserModel };
