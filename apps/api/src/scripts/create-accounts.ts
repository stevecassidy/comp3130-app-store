import { Connect } from "../config/mongoose.config";
import { createUserRecord } from "../controller/user/user.controller";
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import {UserModel} from "../models/user/user.models";

// Check if a CSV file path is provided as a command line argument
if (process.argv.length < 3) {
  console.error('Please provide a CSV file path as an argument');
  console.error('Usage: ts-node create-accounts.ts <csv-file-path>');
  process.exit(1);
}

const csvFilePath = process.argv[2];

// Ensure the file exists
if (!fs.existsSync(csvFilePath)) {
  console.error(`File not found: ${csvFilePath}`);
  process.exit(1);
}

// Connect to MongoDB
Connect().then(async () => {
  try {
    // Read and parse the CSV file
    const fileContent = fs.readFileSync(csvFilePath, 'utf8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`Found ${records.length} records in the CSV file`);

    // Process each record
    for (const record of records) {
      // Validate required fields
      if (!record.email || !record.password) {
        console.error(`Skipping record: Missing required fields (email or password)`);
        continue;
      }

      const existing = await UserModel.findOne({ email: record.email });
      if (existing) {
        console.log(`Skipping existing user: ${record.email}`);
        continue;
      }

      try {
        // Create user account
        const user = await createUserRecord({
          email: record.email,
          password: record.password,
          name: record.name || record.email.split('@')[0], // Use part of email as name if not provided
          salt: '',
          updatedBy: 'create-accounts-script',
          createdBy: 'create-accounts-script'
        });

        console.log(`Created user: ${user.email} with ID: ${user._id}`);
      } catch (error) {
        console.error(`Failed to create user ${record.email}:`, error);
      }
    }

    console.log('Account creation completed');
    process.exit(0);
  } catch (error) {
    console.error('Error processing CSV file:', error);
    process.exit(1);
  }
}).catch(error => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});
