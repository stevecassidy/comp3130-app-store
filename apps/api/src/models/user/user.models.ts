//#region Import
import { model, Schema } from "mongoose";
import { IUser } from "../../interface/user/user.interface";
//#endregion

//#region Schema and Model
const userSchema = new Schema<IUser>({
	email: { type: String, required: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
});

const UserModel = model<IUser>("User", userSchema);
//#endregion

export { UserModel };
