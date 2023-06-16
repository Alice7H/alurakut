import { buildClient, LogLevel } from '@datocms/cma-client-node';

// BFF - back-end for front-end
export default async function receiveRequests(request, response) {
  const client = buildClient({
    apiToken: process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_WRITTER,
    logLevel: LogLevel.BASIC,
  });

  if (request.method === 'POST') {
    const registerCreated = client.items.create({
      item_type: { type: 'item_type', id: '968782' },
      ...request.body,
    });
    response.json({ registerCreated: registerCreated })
    return;
  }

  response.status(404).json({
    message: "Nada no GET, apenas no POST",
  })
}