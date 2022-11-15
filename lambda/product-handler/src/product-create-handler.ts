import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { v4 as uuidv4 } from 'uuid';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    //console.log(`Event: ${JSON.stringify(event, null, 2)}`);

    // Validation
    if (event.body == null) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Invalid request!'
            }),
        };
    }

    // Creates the product
    const product = JSON.parse(event.body);
    console.log("Creating new product...");
    product.id = uuidv4();
    console.log(`Product created with id='${product.id}'! =D`);

    // Publishes a PRODUCT_CREATION event on SNS
    try {
        const snsClient = new SNSClient({ region: process.env.SNS_REGION });
        const snsPublishResult = await snsClient.send(new PublishCommand({
            Message: JSON.stringify(product),
            MessageAttributes: {
                "TYPE": {
                    DataType: "String",
                    StringValue: "PRODUCT_CREATION"
                },
                "SELLER": {
                    DataType: "String",
                    StringValue: "SELLER_1"
                }
            },
            TopicArn: process.env.SNS_TOPIC_ARN
        }));
        console.log(`SNS message published: ${snsPublishResult}`);
    } catch (except) {
        console.log(`Error publishing SNS message: ${except}`);
    }

    // Return OK
    return {
        statusCode: 200,
        body: JSON.stringify({
            product: product
        }),
    };
};
