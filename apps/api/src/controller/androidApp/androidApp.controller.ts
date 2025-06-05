//#region Import
import { Request, Response } from "express";
import { ApiResponse, SingleApiResponse } from "../../helpers/response.helper";
import { CustomRequest } from '../../interface/custom_request.interface'
import {AndroidAppModel} from "../../models/androidApp/androidApp.model";
import { IAndroidApp } from "../../interface/androidApp/androidApp.interface";
import {mkdirSync, renameSync, unlinkSync} from "fs";
import {join} from "path";
import {APK_DIR, IMAGE_DIR} from "../../config/express.config";
import {AddReviewForAndroidAppRequest, AndroidAppReview, CreateAndroidAppRequest, UpdateAndroidAppRequest} from "@app-store/shared-types";
import {AndroidAppImageModel} from "../../models/androidApp/appImage.model";
import {generateAppSlug} from "../../helpers/appslug.helper";
import {AppReviewModel} from "../../models/androidApp/review.model";
import mongoose from "mongoose";

//#endregion


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

    const { id: currentUserId, role: userRole } = req as CustomRequest
    
    try {
        if (userRole === 'admin') {
            // get all apps
            const androidApps = await AndroidAppModel
                .find()
                .sort({"owner": 'desc'})
                .populate('owner')
                .populate('images');
    
            return res.status(200).json(
                ApiResponse({
                    success: true,
                    data: androidApps,
                    count: androidApps.length,
                    statusCode: 200
                })
            );
        }
        // otherwise we return just a few

        const androidAppsLimit = 10;
        let myApp: Omit<Omit<IAndroidApp, never>, never> | null = null;

        if (currentUserId) {
            // get this user's app if there is one
            const ownerID = new mongoose.Types.ObjectId(currentUserId);
            myApp = await AndroidAppModel.findOne({owner: ownerID})
                .populate('owner')
                .populate('images');
        }


        // Use aggregation only for random selection of IDs
        const randomAppIds = await AndroidAppModel.aggregate([
            { $match: {} },
            { $sample: { size: androidAppsLimit } },
            { $project: { _id: 1 } }  // Only project the IDs
        ]);
        
        // Extract the IDs from the result
        const ids = randomAppIds.map(app => app._id);
        
        // Fetch the full documents with populate
        let androidApps = await AndroidAppModel.find({ _id: { $in: ids } })
            .populate('owner')
            .populate('images');

        // if we have myApp then push it onto the start of the list
        if (myApp) {
            // remove myApp from the list
            androidApps = androidApps.filter(app => app._id.toString() !== myApp?._id.toString());
            // and add it at the start (gotta love typescript!)
            androidApps.unshift(myApp as mongoose.Document<unknown, unknown, IAndroidApp> & IAndroidApp & Required<{ _id: mongoose.ObjectId; }>);
        }

        return res.status(200).json(
            ApiResponse({
                success: true,
                data: androidApps,
                count: androidApps.length,
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
    const { role: userRole } = req as CustomRequest

    try {
        const app = await AndroidAppModel
            .findById<IAndroidApp>(id)
            .populate('owner')
            .populate('images')
            .populate('reviews');

        if (app) {
            // rewrite apkFile to a URL
            if (app.apkFile) app.apkFile = `/assets/apk/${app.apkFile}`

            // if we're admin, get the reviews by the owner
            // of this app
            if (userRole === 'admin') {
                const ownerID = new mongoose.Types.ObjectId(app.owner);
                app.hasReviewed = await AppReviewModel.find({userId: ownerID});
            }
            
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
                message: error as string,
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
        const apkFilename = `${app.slug}.apk`;
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
                    id: newImage._id,
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

export const DeleteImageForAndroidApp = async (req: Request, res: Response): Promise<Response> => {

    // Extracting request
    const { id: currentUserId } = req as CustomRequest
    const appId = req.params.id as string;
    const imageID = req.params.imageID as string;

    console.log('deleting image', appId, imageID);

    if (!currentUserId) {
        return res.status(401).json(
            SingleApiResponse({
                success: false,
                data: null,
                statusCode: 401,
            }));
    }

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

    // get the image record if it exists
    const image = await AndroidAppImageModel.findById(imageID);
    if (!image || image?.appId.toString() !== appId) {
        return res.status(404).json(
            SingleApiResponse({
                success: false,
                data: null,
                statusCode: 404
            })
        );
    }
    // delete the image
    try {
        unlinkSync(join(IMAGE_DIR, image.filename));
        await image.deleteOne();
    } catch (error) {
        console.error(error);
        return res.status(500).json(
            SingleApiResponse({
                success: false,
                data: null,
                statusCode: 500
            })
        )
    }
    // all went well    
    return res.status(200).json(
        SingleApiResponse({
            success: true,
            data: {appId},
            statusCode: 200
        })
    );

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