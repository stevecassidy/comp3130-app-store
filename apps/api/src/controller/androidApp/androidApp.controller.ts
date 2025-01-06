//#region Import
import { Request, Response } from "express";
import { ApiResponse, SingleApiResponse } from "../../helpers/response.helper";
import { CustomRequest } from '../../interface/custom_request.interface'
import {AndroidAppModel} from "../../models/androidApp/androidApp.model";
import { IAndroidApp } from "../../interface/androidApp/androidApp.interface";
import {mkdirSync, renameSync} from "fs";
import {join} from "path";
import {APK_DIR} from "../../config/express.config";
import {AndroidAppApkModel} from "../../models/androidApp/apkFile.model";
import {CreateAndroidAppRequest, UpdateAndroidAppRequest} from "@app-store/shared-types";

//#endregion

/**
 * @name ValidateAndroidApp 
 * @memberof Helpers
 * @description All validation required before creating or update androidApp
 * @param value (String) - app name to be validated
 * @return Boolean - True as Valid to Create or Update, False as Not Valid
 */
const ValidateAndroidAppName = async (value: string, id?: string): Promise<boolean | undefined> => {

    // Fetch androidApp based on requested name
    const androidApp = await AndroidAppModel.findOne<IAndroidApp>({
        name: { $regex: value, $options: 'i' },
         _id: { $ne: id } 
    })

    if (androidApp)
        if (value === androidApp.name)
            return false

    return true
}


/**
 * @name GetAndroidApps 
 * @memberof Actions
 * @description Fetch all androidApps
 * @param req - Object passed by client
 * @param res - Object to be passed by server
 * @return Array
 */
export const GetAndroidApps = async (req: Request, res: Response): Promise<Response> => {

    // Extracting request
    const searchKey = req.params.searchKey as string;
    const pageNumber = Number(req.params.pageNumber as string);

    try {

        let androidApps: IAndroidApp[] = []
        let totalAndroidAppCount = 0
        const androidAppsLimit = 10;

        // get all Apps 
        if (searchKey === '_') {
            // Fetch AndroidApps
            androidApps = await AndroidAppModel.find<IAndroidApp>({}); //.skip(pageNumber === 1 ? 0 : (pageNumber - 1) * 10).limit(androidAppsLimit);
            // Get the total count (for pagination)
            totalAndroidAppCount = await AndroidAppModel.countDocuments({});
        } else {
            // Create expression object
            const searchQuery = {
                name: { $regex: `.*${searchKey}.*`, $options: 'i' },
            };

            // Fetch AndroidApps
            androidApps = await AndroidAppModel.find<IAndroidApp>(searchQuery).skip(pageNumber === 1 ? 0 : pageNumber * 10).limit(androidAppsLimit);

            // Get the total count (for pagination)
            totalAndroidAppCount = await AndroidAppModel.countDocuments(searchQuery);
        }


        return res.status(200).json(
            ApiResponse({
                success: true,
                data: androidApps,
                count: totalAndroidAppCount,
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
}


/**
 * @name GetAndroidApp
 * @memberof Actions
 * @description Get one androidApp
 * @param req - Object passed by client
 * @param res - Object to be passed by server
 * @return AndroidApp
 */
export const GetAndroidApp = async (req: Request, res: Response): Promise<Response> => {

    // Extracting request
    const id = req.params.id as string;
    
    try {

        const app = await AndroidAppModel
            .findById<IAndroidApp>(id)
            .populate('apkFiles');
        console.log(app);

        return res.status(200).json(
            SingleApiResponse({
                success: true,
                data: app,
                statusCode: 200
            })
        );
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json(
            SingleApiResponse({
                success: false,
                data: null,
                statusCode: 500
            })
        );
    }
}



/**
 * @name CreateAndroidApp
 * @memberof Actions
 * @description Function for creating androidApp
 * @param req - Object passed by client
 * @param res - Object to be passed by server
 * @returns Res
 */
export const CreateAndroidApp = async (req: Request, res: Response): Promise<Response> => {

    // Extracting request
    const { id: currentUserId } = req as CustomRequest
    const body = req.body as CreateAndroidAppRequest

    try {

        // Validation
        const validName = await ValidateAndroidAppName(body.name)

        if (!validName)
            return res.status(200).json(
                SingleApiResponse({
                    success: true,
                    data: null,
                    statusCode: 409,
                    message: 'AndroidApp Name already exist.'
                })
            );

        // AndroidApp Object
        const newAndroidApp = new AndroidAppModel({
            name: body.name,
            description: body.description,
            owner: body.owner,
            createdBy: currentUserId,
            dateCreated: new Date(),
        })
        // Save androidApp object
        await newAndroidApp.save()

        return res.status(201).json(
            SingleApiResponse({
                success: true,
                data: newAndroidApp,
                statusCode: 201
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
}

/**
 * @name UpdateAndroidApp
 * @memberof Actions
 * @description Function for updating androidApp
 * @param req - Object passed by client
 * @param res - Object to be passed by server
 * @returns Res
 */
export const UpdateAndroidApp = async (req: Request, res: Response): Promise<Response> => {

    // Extracting request
    const { id: currentUserId } = req as CustomRequest
    const appId = req.params.id as string;
    const body = req.body as UpdateAndroidAppRequest

    try {
        // Trigger find then update
        const updated = await AndroidAppModel.findOneAndUpdate(
            { _id: appId },
            {
                name: body.name,
                description: body.description,
                owner: currentUserId,
                dateUpdated: Date.now()
            },
            { new: true }
        )

        return res.status(200).json(
            SingleApiResponse({
                success: true,
                data: updated,
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
}

/**
 * @name DeleteAndroidApp
 * @memberof Actions
 * @description Function for deleting androidApp
 * @param req - Object passed by client
 * @param res - Object to be passed by server
 * @returns Res
 */
export const DeleteAndroidApp = async (req: Request, res: Response): Promise<Response> => {

    // Extracting request
    const { id: currentUserId } = req as CustomRequest
    const androidAppId = req.params.androidAppId as string;

    try {

        await AndroidAppModel.findOneAndUpdate<IAndroidApp>(
            { _id: androidAppId },
            { isActive: false, updatedBy: currentUserId, dateUpdated: Date.now() }
        )

        return res.status(200).json(
            SingleApiResponse({
                success: true,
                data: null,
                statusCode: 200
            })
        );

    } catch (error) {
        return res.status(500).json(
            SingleApiResponse({
                success: false,
                data: null,
                statusCode: 500
            })
        );
    }
}


// APK Routes


/**
 * @name AddAPKForAndroidApp
 * @memberof Actions
 * @description Add an APK binary image to an androidApp
 * @param req - Object passed by client
 * @param res - Object to be passed by server
 * @returns Res
 */
export const AddAPKForAndroidApp = async (req: Request, res: Response): Promise<Response> => {

    // Extracting request
    const { id: currentUserId } = req as CustomRequest
    const appId = req.params.id as string;
    const apk = req.file as Express.Multer.File;

    try {
        // TODO: validate the apk

        // move to the final location
        mkdirSync(APK_DIR, { recursive: true });
        const apkPath = join(APK_DIR, apk.filename);
        renameSync(apk.path, apkPath);


        // create db record for apk
        const newApk = new AndroidAppApkModel({
            filename: apk.filename,
            appId,
            createdBy: currentUserId,
        });

        newApk.save();

        // generate response

        return res.status(201).json(
            SingleApiResponse({
                success: true,
                data: {
                    appId,
                    url: `/apk/${apk.filename}`,
                },
                statusCode: 201
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
}
