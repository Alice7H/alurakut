import { SiteClient } from 'datocms-client';
import { buildClient, LogLevel } from '@datocms/cma-client-node';

export default async function receiveRequests(request, response) {
  const client = buildClient({
    apiToken: process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_WRITTER,
    logLevel: LogLevel.BASIC,
  });

  if (request.method === 'POST') {
    const registerCreated = await client.items.create({
      item_type: { type: 'item_type', id: '975903' },
      ...request.body,
    });

    response.json({ registerCreated: registerCreated, })
    return;
  }

  response.status(404).json({
    message: "Nada no GET, apenas no POST",
  })
}