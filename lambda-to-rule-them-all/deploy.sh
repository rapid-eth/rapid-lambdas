#!/bin/sh

FUNCTION_NAME=lambda-to-rule-them-all

echo "Creating temp dir..."
mkdir temp

cp -r *.js package.json temp/.
cp -r node_modules temp/.
cp ../common.js temp/.

echo "Zipping ..."
cd temp
zip -r -q ./aws_lamda_deploy.zip .

echo "Updating lambda function: ${FUNCTION_NAME}..."
aws lambda --profile lambda update-function-code \
--function-name ${FUNCTION_NAME} \
--zip-file fileb://aws_lamda_deploy.zip

# TODO encrypt/decrypt vars with KMS
cd ..
count=$( cat ./secret.env | wc -l )  
if [ $count -lt 2 ] ; then
    VARS=`cat ./secret.env`
else
    # https://stackoverflow.com/questions/1251999/how-can-i-replace-a-newline-n-using-sed
    VARS=`sed -e ':a' -e 'N' -e '$!ba' -e 's/\n/,/g' ./secret.env`
fi

aws lambda --profile lambda update-function-configuration \
--function-name ${FUNCTION_NAME} \
--environment Variables="{$VARS}"


echo "Removing deploy zip file and temp dir"
rm -rf ./temp
echo "DONE"
