#!/bin/sh

FUNCTION_NAME=$1

TARGET=$FUNCTION_NAME

if [ ! -d "$TARGET" ]; then
  echo "$TARGET does not exist, exiting..."
  exit 0
fi

echo "Creating temp dir..."
mkdir temp

cp -r ./$TARGET/node_modules temp/.
cp $TARGET/*.js $TARGET/package.json temp/.
cp common.js $TARGET/package.json temp/.


echo "Zipping ..."
cd temp
zip -r -q ../aws_lamda_deploy.zip .
cd ..

echo "Updating lambda function: ${FUNCTION_NAME}..."
aws lambda --profile lambda update-function-code \
--function-name ${FUNCTION_NAME} \
--zip-file fileb://aws_lamda_deploy.zip

# TODO encrypt/decrypt vars with KMS
count=$( cat ./secret.env | wc -l )  
if [ $count -lt 2 ] ; then
    VARS=`cat ${TARGET}/secret.env`
else
    # https://stackoverflow.com/questions/1251999/how-can-i-replace-a-newline-n-using-sed
    VARS=`sed -e ':a' -e 'N' -e '$!ba' -e 's/\n/,/g' ${TARGET}/secret.env`
fi

aws lambda --profile lambda update-function-configuration \
--function-name ${FUNCTION_NAME} \
--environment Variables="{$VARS}"

echo "Removing deploy zip file and temp dir"
rm aws_lamda_deploy.zip
rm -rf temp
echo "DONE"
