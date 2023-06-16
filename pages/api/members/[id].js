import { buildClient, LogLevel } from '@datocms/cma-client-node';

export default async function receiveRequests(request, response) {
  let register = '';
  const { id } = request.query

  const client = buildClient({
    apiToken: process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_WRITTER,
    logLevel: LogLevel.BASIC,
  });

  if (request.method === 'PUT') {
    if (id) {
      register = await client.items.update(id, {
        ...request.body,
      });
    }
    console.log(register)
    response.json({ register: register })
    return;
  }

  response.status(404).json({
    message: "Nada no GET, apenas no POST",
  })

}