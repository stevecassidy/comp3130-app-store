//#region Import
import { UserModel } from "../../models/user/user.models";
import { Request, Response } from "express";
import { SingleApiResponse } from "../../helpers/response.helper";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { IUser, IUserBase } from "../../interface/user/user.interface";

dotenv.config();
//#endregion

/**
 * 
 * @param user 
 * @returns 
 */
export const createUserRecord = async (user: IUserBase): Promise<IUser> => {
	const password = CryptoJS.AES.encrypt(
			user.password,
			secretKey
		).toString();
	const newUser = new UserModel({...user, password: password,});
	await newUser.save();
	return newUser;
};


// Get the secret key in .env
const secretKey = process.env.TOKEN_KEY as string;

/**
 * @name CreateUser 
 * @memberof Actions
 * @description Function for creating user account
 * @param req - Object passed by client
 * @param res - Object to be passed by server
 * @return Array
 */
const CreateUser = async (req: Request, res: Response): Promise<Response> => {
	try {

		const isUserEmailExisting = await UserModel.findOne<IUser>({
			email: req.body.email
		});

		if (isUserEmailExisting)
			return res.status(409).json(
				SingleApiResponse({
					success: true,
					data: null,
					statusCode: 409
				})
			);


		// Save then Return the latest
		const user = await createUserRecord({
			email: req.body.email,
			password: req.body.password,
			name: req.body.name,
			updatedBy: '1',
			createdBy: '1'
		})

		const token = jwt.sign({ id: user._id.toString() }, `${secretKey}`, {
			expiresIn: "2h"
		});

		return res.status(201).json(
			SingleApiResponse({
				success: true,
				data: { user, token: token },
				statusCode: 201
			})
		);
	} catch (error: unknown) {
		console.log(error)
		return res.status(500).json(
			SingleApiResponse({
				success: false,
				data: null,
				statusCode: 500
			})
		);
	}
};

export { CreateUser };
