import { http, HttpResponse } from 'msw'
import { mockData } from './data';

const data = mockData;


export const handlers = [
    http.get('/shopping-lists', () => {
        // ...and respond to them using this JSON response.
        console.log("Captured a GET /shoppinng-lists");
        return HttpResponse.json(data);
    }),
    // POST request for /create-list
    http.post('/create-list', async ({ request, params, cookies }) => {
        console.log("requests: ", request);
        const requestBody = await request.json();
        console.log("request Body: ", requestBody);

        const { listId, ownerId, membersIds, listName, productsInList, archived } = requestBody;

        // Check if all necessary attributes are present
        if (listId && ownerId && membersIds && listName && productsInList) {
            // Return the object with an OK response
            return HttpResponse.json({ message: "Shopping list created successfully!", listObject: requestBody });
        } else {
            // Throw a bad request
            // This is synonymous to "new Response()".
            return new HttpResponse('Bad request: Missing required attributes: listId, ownerId, membersIds, listName, productsInList, archived', {
                status: 400,
                headers: {
                    'Content-Type': 'text/plain',
                },
            })

            // return res(ctx.status(400), ctx.json({ error: "B" }));
        }
    }),
    // POST request for /update-list
    http.post('/update-list', async ({ request, params, cookies }) => {

        console.log("requests: ", request);
        const requestBody = await request.json();
        console.log("request Body: ", requestBody);

        const { listId, ownerId, membersIds, listName, productsInList, archived } = requestBody;

        // Check if all necessary attributes are present
        if (listId && ownerId && membersIds && listName && productsInList) {
            // Return the object with an OK response
            return HttpResponse.json({ message: "Shopping list updated successfully!", listObject: requestBody });
        } else {
            // Throw a bad request
            return new HttpResponse('Bad request: Missing required attributes', {
                status: 400,
                headers: {
                    'Content-Type': 'text/plain',
                },
            })
            //return res(ctx.status(400), ctx.json({ error: "Bad request: Missing required attributes" }));
        }
    }),
    http.post('/delete-list', async ({ request, params, cookies }) => {
        console.log("requests: ", request);
        const requestBody = await request.json();
        console.log("request Body: ", requestBody);

        const { listId } = requestBody;

        // Check if listId is present
        if (listId) {
            // Return OK response with success deletion message
            return HttpResponse.json({ message: "Shopping list deleted successfully!" });
        } else {
            // Throw a bad request
            return new HttpResponse('Bad request: Missing listId"', {
                status: 400,
                headers: {
                    'Content-Type': 'text/plain',
                },
            })
            // return HttpResponse.error()({ message: "Shopping list deleted successfully!" });
            // return res(ctx.status(400), ctx.json({ error: "Bad request: Missing listId" }));
        }
    })
]