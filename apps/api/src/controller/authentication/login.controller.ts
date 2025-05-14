//#region Import
import { UserModel } from "../../models/user/user.models";
import { AccessTokenModel } from "../../models/access_token/access_token.model";
import { Request, Response } from "express";
import { SingleApiResponse } from "../../helpers/response.helper";
import { IUser } from "../../interface/user/user.interface";
import jwt from "jsonwebtoken";

import * as dotenv from "dotenv";
import { IAccessToken } from "../../interface/access_token/access_token.interface";
import {hashPassword} from "../user/user.controller";
dotenv.config();
//#endregion

const secretKey = process.env.TOKEN_KEY as string;

const generateToken = (user: IUser) => {

		// Token Generation
		const token = jwt.sign({ id: user._id.toString() }, `${secretKey}`, {
			expiresIn: "2h"
		});

		return token;
	}


/**
 * @name Login 
 * @memberof Actions
 * @description Function for logging in user account
 * @param req - Object passed by client
 * @param res - Object to be passed by server
 * @return Array
 */
const Login = async (req: Request, res: Response): Promise<Response> => {

	// Extract request from bbody
	const email = req.body.email;
	const password = req.body.password;

	try {

		// Fetch user based on email and password
		const user = await UserModel.findOne<IUser>({ email: email });

		if (!user)
			return res.status(200).json(
				SingleApiResponse({
					success: true,
					data: null,
					statusCode: 404
				})
			);

		// Check if hash password is equal
		const pwHash = hashPassword(password, user.salt);

		// Flagger for password
		if (user.password !== pwHash)
			return res.status(200).json(
				SingleApiResponse({
					success: true,
					data: null,
					statusCode: 404
				})
			);


		// Check if user access token is already existing
		let userAccessToken = await AccessTokenModel.findOne({
			userId: user._id
		});

		if (userAccessToken === null) {

			// Token Generation
			const token = jwt.sign(
				{ id: user._id.toString() }, 
				secretKey, 
				{ expiresIn: "7d" }
			);

			// Save Access Token
			userAccessToken = new AccessTokenModel({
				userId: user._id.toString(),
				accessToken: token
			});

			await userAccessToken.save();
		}

		// Return
		return res.status(200).json(
			SingleApiResponse({
				success: true,
				data: { user, token: userAccessToken.accessToken },
				statusCode: 200
			})
		);
	} catch (error: unknown) {
		return res.status(500).json(
			SingleApiResponse({
				success: false,
				data: null,
				statusCode: 500
			})
		);
	}
};

export { Login };
