TAG="[BUILD] "
PROD_DIR="/opt/formsg"

echo $TAG "FormSG Build"

# Cleanup
echo $TAG "Cleaning up previous builds..."
#rm -Rf ./dist
echo $TAG "Update node modules"
#npm ci --legacy-peer-deps

# Build (produces ./dist)
echo $TAG "> npm build"
NODE_OPTIONS="--max-old-space-size=4096 --openssl-legacy-provider" npm run build
#NODE_OPTIONS="--max-old-space-size=4096 --openssl-legacy-provider" npm run build:frontend

echo $TAG "Cleanup old prod"
echo $TAG "> pm2 stop"
pm2 stop "FormSG" || true
rm -Rf $PROD_DIR/*

echo $TAG "Copy to prod workdir"
# Copy
echo $TAG "Copy app"
cp -r ./node_modules $PROD_DIR
cp ./package.json $PROD_DIR
cp ./package-lock.json $PROD_DIR
cp -r ./dist $PROD_DIR

# Move backend back to root working dir
mv $PROD_DIR/dist/backend/src $PROD_DIR
mv $PROD_DIR/dist/backend/shared $PROD_DIR

echo $TAG "Copy config"
cp .env $PROD_DIR
cp -r ./__tests__ $PROD_DIR # contains mock certs

# Switch to prod workdir
echo $TAG "Switch to prod workdir"
cd $PROD_DIR
#npm prune --production --legacy-peer-deps

echo $TAG "PM2 start"
pm2 delete FormSG || : && pm2 start npm --name FormSG -- start
pm2 save
