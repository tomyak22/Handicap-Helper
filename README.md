# Handicap-Helper

***Server Creation***
net start MongoDB (as admin)
net stop MongoDB (as admin)

***Local Server Startup***
npm run start:server (within handicap-helper)

**JSON Web Token**
npm install --save jsonwebtoken

**Bcrypt**
npm install --save bcrypt

**Mongoose**
npm install --save mongoose

**Unique Validator**
npm install --save mongoose-unique-validator

**Express**
npm install --save express

**Setup.bat**
be sure to run setup.bat within /backend before running server.js

**Random Key Generator**
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"

**Formula for Handicap**
(Score – Course Rating) x 113 / Slope Rating

**Pre-Build for Docker**
ng build --prod
