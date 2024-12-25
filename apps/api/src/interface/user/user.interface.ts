//#region Import
import mongoose from "mongoose";
import { IBase } from "../base.interface";
//#endregion

// Model
interface IUserBase extends IBase {
	email: string;
	password: string;
	name: string;
}

interface IUser extends IUserBase {
	_id: mongoose.Types.ObjectId;
}

export type { IUser, IUserBase };
