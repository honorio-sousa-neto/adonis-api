import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import Moment from 'App/Models/Moment'

export default class CommentsController {
  public async store ({ request, response, params }: HttpContextContract) {
    const body = request.body()
    const momentId = params.momentId

    // Break the application if there is no momentId passed
    
    await Moment.findOrFail(momentId)

    body.momentId = momentId
    const comment = await Comment.create(body)

    response.status(201)

    return {
      message: 'Comentário adicionado com sucesso',
      data: comment
    }
  }
}
