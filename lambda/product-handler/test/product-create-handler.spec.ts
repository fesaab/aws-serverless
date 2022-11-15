import { readFileSync } from 'fs';
import { APIGatewayEvent } from 'aws-lambda';
import { handler } from '../src/product-create-handler'

describe('Product Create', () => {

    let productCreateEvent: APIGatewayEvent;

    beforeEach(async () => {
        productCreateEvent = JSON.parse(readFileSync('./events/product-create.json', 'utf-8'));
    });

    it('should create a product', async () => {
        
        // when
        const result = await handler(productCreateEvent);

        // then
        expect(result).toBeDefined();
        expect(result.statusCode).toBe(200);
        console.log(result.body);
    })

});
