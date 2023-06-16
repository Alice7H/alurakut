import { buildClient, LogLevel } from '@datocms/cma-client-node';

export default async function receiveRequests(request, response) {
  let register = '';

  const client = buildClient({
    apiToken: process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_WRITTER,
    logLevel: LogLevel.BASIC,
  });

  if (request.method === 'POST') {
    register = await client.items.create({
      item_type: { type: 'item_type', id: '1064202' },
      ...request.body,
    });
    response.json({ register: register })
    return;
  }

  response.status(404).json({
    message: "Nada no GET, apenas no POST",
  })

}