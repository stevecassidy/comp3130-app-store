//#region Import
import { model, Schema } from "mongoose";
import { IUser } from "../../interface/user/user.interface";
//#endregion

//#region Schema and Model
const userSchema = new Schema<IUser>({
	email: { type: String, required: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
	dateCreated: { type: Date, required: true, default: Date.now() },
	createdBy: { type: String, required: true },
	dateUpdated: { type: Date, required: true, default: Date.now() },
	updatedBy: { type: String, required: true }
});

const UserModel = model<IUser>("User", userSchema);
//#endregion

export { UserModel };
