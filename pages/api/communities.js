import { SiteClient } from 'datocms-client';

// BFF - back-end for front-end
export default async function receiveRequests(request, response) {
  const client = new SiteClient(process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_WRITTER);
  if (request.method === 'POST') {
    //DTO - validações antes de confirmar a criação da nova comunidade
    const registerCreated = await client.items.create({
      itemType: "968782",
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