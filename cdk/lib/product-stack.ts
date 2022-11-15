import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as sns from 'aws-cdk-lib/aws-sns';

export class ProductStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Product SNS
    const productUpdateSNSTopic = new sns.Topic(this, 'ProductUpdateSNSTopic', {
      contentBasedDeduplication: true,
      displayName: 'Product updates topic',
      fifo: true,
      topicName: 'productUpdateSNSTopic',
    });
    new cdk.CfnOutput(this, 'productUpdateSNSTopicArn', {
      description: 'ProductUpdateSNSTopic ARN',
      value: productUpdateSNSTopic.topicArn
    });

    // Product List Handler
    const productListHandler = new lambda.Function(this, "ProductListHandler", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("../lambda/product-handler/build/"),
      handler: "product-list-handler.handler",
      environment: {
        ENV: "TEST"
      }
    });
    new cdk.CfnOutput(this, 'productListHandlerArn', {
      description: 'ProductListHandler ARN',
      value: productListHandler.functionArn
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
    new cdk.CfnOutput(this, 'productCreateHandlerArn', {
      description: 'ProductCreateHandler ARN',
      value: productCreateHandler.functionArn
    });
    productUpdateSNSTopic.grantPublish(productCreateHandler);

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
