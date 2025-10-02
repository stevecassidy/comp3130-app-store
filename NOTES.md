# Notes

- [x] Upload images for an app, screenshots, app icon, display in app card/page
- [x] Generate a 'slug' for an app on creation
- [ ] use slug instead of random ID
- [x] App description uses Markdown
- [x] Add Data Safety section to the app creation form
- [x] Option to update/edit an app
- [x] Add 'review instructions' to app, again Markdown containing how-to for review
- [x] Downloaded APK file should have a better name, currently just a hash
- [x] Add a field to link to the Github repository for the app
- [ ] User can be assigned other apps to review
- [x] User can add a review for an app including a rating and feedback (markdown)
- [x] Owner of app can see review feedback and ratings for their app
- [x] User roles: staff/student, staff can see more detail, eg. user identity, github links
- [x] Work out how students will login/register
- [x] Can delete and maybe re-order screenshot images
- [x] User can see reviews that they have left
- [ ] Show average rating for apps based on reviews

## Signing Up

Bulk creation of accounts from spreadsheet with:

```bash
npm run create-accounts xxxxx.csv
```

in the apps/api folder.  xxxxx.csv contains email, password and name columns.

------------

## Assignment Milestones

- Proposal: 5% student writes an app proposal detailing features, users, etc
- Design: 10% student creates wireframes in Figma based on proposal, identifies
  which parts will be developed in the MVP, extends the proposal document
- Implementation: 20% student implements the app MVP in Flutter, publishes in the 'App Store'
- Review: 5% student reviews one or more apps in the 'App Store'

## App Review Process

- Student adds app details, uploads APK for review
- N reviewers are assigned to the app
- Publishing review
  - all required details are present and appropriate
  - reviewer downloads the APK, installs locally and tests according to the how-to
  - reviewer adds a review comment and marks as approved or rejected

## App Details

### Data Safety

Data that may be shared with other companies or organisations

For each of the below, what data is shared and for what purpose?

- App Activity
- Personal Information
- Location
- App info and performance
- Device Information

Is data encrypted in the app? In transit?
