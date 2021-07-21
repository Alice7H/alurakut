import { SiteClient } from 'datocms-client';

export default async function receiveRequests(request, response) {
  const client = new SiteClient(process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_WRITTER);
  if (request.method === 'POST') {
    const registerCreated = await client.items.create({
      itemType: "975387",
      ...request.body,
    });

    response.json({
      registerCreated: registerCreated,
    })
    return;
  }

  response.status(404).json({
    message: "Nada no GET, apenas no POST",
  })
}