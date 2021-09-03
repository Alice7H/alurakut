import { SiteClient } from 'datocms-client';

export default async function receiveRequests(request, response) {
  const client = new SiteClient(process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_WRITTER);

  if (request.method === 'POST') {
    let register = "";
    if (request.body.id) {
      register = await client.items.update(request.body.id, {
        ...request.body,
      });
    } else {
      register = await client.items.create({
        itemType: "1064202",
        ...request.body,
      });
    }

    response.json({
      register: register,
    })
    return;
  }

  response.status(404).json({
    message: "Nada no GET, apenas no POST",
  })
}