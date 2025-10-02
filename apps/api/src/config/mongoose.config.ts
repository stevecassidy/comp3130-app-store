//#region Import
import mongoose, { ConnectOptions } from "mongoose";
//#endregion

//#region Config

console.log(process.env.MONGO_DB);

// Exit application when error occurs
mongoose.connection.on("error", () => {
	// TODO: Logger Here
	process.exit(-1);
});

export const Connect = async () => {
	try {
		await mongoose.connect(
			`${process.env.MONGO_DB}${process.env.MONGO_DB_SCHEMA}`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			} as ConnectOptions
		);

		console.log(
			`⚡️[dtbase]: MongoDB Connected at ${process.env.MONGO_DB}`
		);
	} catch (err) {
		console.log(`Failed to connect to MongoDB - ${process.env.MONGO_DB}${process.env.MONGO_DB_SCHEMA}`, err);
	}
};
//#endregion
