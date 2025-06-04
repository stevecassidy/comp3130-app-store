import { Request } from "express";

interface CustomRequest extends Request {
	id: string;
	role: string;
}

export type { CustomRequest };
