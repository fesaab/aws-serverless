import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class ProductStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Product List Handler
    const productListHandler = new lambda.Function(this, "ProductListHandler", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("../lambda/product-handler/build/"),
      handler: "product-list-handler.handler",
      environment: {
        ENV: "TEST"
      }
    });

    // Product Create Handler
    const productCreateHandler = new lambda.Function(this, "ProductCreateHandler", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("../lambda/product-handler/build/"),
      handler: "product-create-handler.handler",
      environment: {
        ENV: "TEST"
      }
    });

    // API Gateway instance
    const api = new apigateway.RestApi(this, "product-api", {
      restApiName: "Product API",
      description: "Product related APIs"
    });

    // Method GET /
    const listProductsLambdaIntegration = new apigateway.LambdaIntegration(productListHandler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });
    api.root.addMethod("GET", listProductsLambdaIntegration);


    // Method POST /
    const createProductsLambdaIntegration = new apigateway.LambdaIntegration(productCreateHandler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });
    api.root.addMethod("POST", createProductsLambdaIntegration);
  }
}
