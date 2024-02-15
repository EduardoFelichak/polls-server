import { FastifyInstance } from "fastify";
import { votting } from "../../utils/voting-pub-sub";
import z from "zod";

export async function pollResults(app: FastifyInstance){
    app.get('/polls/:pollId/results', { websocket: true }, (connection, request) => {
        const getPollParams = z.object({
            pollId: z.string().uuid(),
        })

        const { pollId } = getPollParams.parse(request.params)

        votting.subscribe(pollId, (message) => {
            connection.socket.send(JSON.stringify(message))
        })
    })
}