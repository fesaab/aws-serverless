import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    //console.log(`Event: ${JSON.stringify(event, null, 2)}`);

    if (event.body == null) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Invalid request!'
            }),
        };
    }

    const product = JSON.parse(event.body);
    console.log("Creating new product...");
    product.id = uuidv4();
    console.log(`Product created with id='${product.id}'! =D`);

    return {
        statusCode: 200,
        body: JSON.stringify({
            product: product
        }),
    };
};
