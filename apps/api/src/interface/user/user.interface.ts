//#region Import
import mongoose from "mongoose";
import { IBase } from "../base.interface";
//#endregion

// Model
interface IUser extends IBase {
	_id: mongoose.Types.ObjectId;
	email: string;
	password: string;
	name: string;
}

export type { IUser };
