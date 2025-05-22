//#region Import
import { Request, Response } from "express";
import { ApiResponse, SingleApiResponse } from "../../helpers/response.helper";
import { CustomRequest } from '../../interface/custom_request.interface'
import {AndroidAppModel} from "../../models/androidApp/androidApp.model";
import { IAndroidApp } from "../../interface/androidApp/androidApp.interface";
import {mkdirSync, renameSync, unlinkSync} from "fs";
import {join} from "path";
import {APK_DIR, IMAGE_DIR} from "../../config/express.config";
import {AddReviewForAndroidAppRequest, CreateAndroidAppRequest, UpdateAndroidAppRequest} from "@app-store/shared-types";
import {AndroidAppImageModel} from "../../models/androidApp/appImage.model";
import {generateAppSlug} from "../../helpers/appslug.helper";
import {AppReviewModel} from "../../models/androidApp/review.model";

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


const validateID = async (slug: string): Promise<boolean> => {
    const found = await AndroidAppModel.findOne({slug: slug});
    return found === null;
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
            .populate('owner')
            .populate('images');

        if (app) {
            // rewrite apkFile to a URL
            if (app.apkFile) app.apkFile = `/assets/apk/${app.apkFile}`

            return res.status(200).json(
                SingleApiResponse({
                    success: true,
                    data: app,
                    statusCode: 200
                })
            );
        } else {
            return res.status(404).json(
                SingleApiResponse({
                    success: false,
                    data: null,
                    statusCode: 404
                })
            );
        }
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

        const appSlug = await generateAppSlug(validateID);
    
        // AndroidApp Object
        const newAndroidApp = new AndroidAppModel({
            name: body.name,
            slug: appSlug,
            description: body.description || '',
            instructions: body.instructions || '',
            owner: currentUserId,
            dataSafety: body.dataSafety || {},
            createdBy: currentUserId,
            dateCreated: new Date(),
            repoLink: body.repoLink || '',
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
                owner: currentUserId,
                dateUpdated: Date.now(),
                repoLink: body.repoLink || '',
                description: body.description || '',
                instructions: body.instructions || '',
                dataSafety: body.dataSafety || {},
                createdBy: currentUserId,
                dateCreated: new Date(),
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

        // get the app, check it's owned by this user
        const app = await AndroidAppModel.findById(appId);
        if (!app || app?.owner._id.toString() !== currentUserId) {
            return res.status(404).json(
                SingleApiResponse({
                    success: false,
                    data: null,
                    statusCode: 404
                })
            );
        }
        
        // if there is already an apk, delete it
        if (app.apkFile) {
            try {
                unlinkSync(join(APK_DIR, app.apkFile));
            } catch (error) {
                console.error(error);
            }
        }
        // move to the final location
        const apkFilename = `${apk.filename}.apk`;
        const apkPath = join(APK_DIR, apkFilename);

        mkdirSync(APK_DIR, { recursive: true });
        renameSync(apk.path, apkPath);

        const apkURL = `/assets/apk/${apkFilename}`;
        // update the app
        app.apkFile = apkFilename;
        await app.save();

        // generate response
        return res.status(201).json(
            SingleApiResponse({
                success: true,
                data: {
                    appId,
                    url: apkURL,
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


// Image Routes


/**
 * @name AddImageForAndroidApp
 * @memberof Actions
 * @description Add an image to an androidApp
 * @param req - Object passed by client
 * @param res - Object to be passed by server
 * @returns Res
 */
export const AddImageForAndroidApp = async (req: Request, res: Response): Promise<Response> => {

    // Extracting request
    const { id: currentUserId } = req as CustomRequest
    const appId = req.params.id as string;
    const imageFile = req.file as Express.Multer.File;
    const role = req.body.role as string;

    try {
        // move to the final location
        mkdirSync(IMAGE_DIR, { recursive: true });
        const extension = imageFile.originalname.split('.').pop();
        const imageFileName = `${imageFile.filename}.${extension}`;
        renameSync(imageFile.path, join(IMAGE_DIR, imageFileName));

        // create db record for apk
        const newImage = new AndroidAppImageModel({
            filename: imageFileName,
            appId,
            role,
            createdBy: currentUserId,
        });

        newImage.save();

        return res.status(201).json(
            SingleApiResponse({
                success: true,
                data: {
                    appId,
                    role,
                    url: `/assets/images/${imageFileName}`,
                },
                statusCode: 201
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


export const AddReviewForAndroidApp = async (req: Request, res: Response): Promise<Response> => {

    // Extracting request
    const { id: currentUserId } = req as CustomRequest
    const appId = req.params.id as string;
    const { rating, comment } = req.body as AddReviewForAndroidAppRequest;

    // reject if there is no valid users
    if (!currentUserId) {
        return res.status(401).json(
            SingleApiResponse({
                success: false,
                data: null,
                statusCode: 401,
            }));
    }

    // confirm that the app exists
    const app = await AndroidAppModel.findById(appId);
    if (!app) {
        return res.status(404).json(
            SingleApiResponse({
                success: false,
                data: null,
                statusCode: 404,
            }));
    }

    // create a new review record
    const newReview = new AppReviewModel({
        appId,
        rating,
        comment,
        userId: currentUserId,
    });
    newReview.save();

    return res.status(201).json(
        SingleApiResponse({
            success: true,
            data: {
                appId,
                rating,
                comment,
            },
            statusCode: 201
        })
    );
}