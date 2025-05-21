//#region Import
import jwt, { Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { SingleApiResponse } from "../helpers/response.helper";
import { CustomRequest } from "../interface/custom_request.interface";
//#endregion

/**
 * @name AuthMiddleware 
 * @memberof Middeware
 * @description validate the user token, populate the request with the user id, return 401 if not valid
 * @param req - Object passed by client
 * @param res - Object to be passed by server
 * @param next - next function that will run if token is valid
 * @return Array
 */
export const AuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const secretKey: Secret = `${process.env.TOKEN_KEY}`;
		const token = req.header("Authorization")?.replace("Bearer ", "");

		if (!token) throw new Error();
		// Decode token
		// eslint-disable-next-line
		const decoded = jwt.verify(token, secretKey) as any;

		// Make request as CustomRequest
		// Add decoded token to string property in CustomRequest
		(req as CustomRequest).id = decoded.id;

		// Run next function
		next();
	} catch (err: unknown) {
		console.log('Error in AuthMiddleware', err);
		res.status(401).json(
			SingleApiResponse({ success: false, data: null, statusCode: 401 })
		);
	}
};
