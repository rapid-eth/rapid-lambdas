#!/bin/sh

FUNCTION_NAME=lambda-to-rule-them-all

echo "Creating temp dir..."
mkdir temp

cp -r *.js package.json temp/.
cp -r node_modules temp/.


echo "Zipping ..."
cd temp
zip -r -q ./aws_lamda_deploy.zip .

echo "Updating lambda function: ${FUNCTION_NAME}..."
aws lambda --profile lambda update-function-code --function-name ${FUNCTION_NAME} --zip-file fileb://aws_lamda_deploy.zip 

echo "Removing deploy zip file and temp dir"
cd ..
rm -rf ./temp
echo "DONE"
