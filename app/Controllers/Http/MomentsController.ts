import { v4 as uuidv4 } from 'uuid'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Moment from 'App/Models/Moment'

export default class MomentsController {

  private optionsValidator = {
    types: ['image'],
    size: '3mb'
  }
  public async store({ request }: HttpContextContract) {

    const body = request.body()
    const image = request.file('image', this.optionsValidator)

    if (image) {
      const imgName = `${uuidv4()}.${image.extname}`

      await image.move(Application.tmpPath('uploads'), {
        name: imgName
      })

      body.image = imgName
    }

    const moment = await Moment.create(body)
    return {
      message: 'Momento criado com sucesso',
      body: moment
    }
  }

  public async index() {
    const moments = await Moment.query().preload('comments')

    return {
      data: moments
    }
  }

  public async show({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)

    await moment.load('comments')
    return {
      data: moment
    }
  }

  public async update({ params, request }: HttpContextContract) {

    const moment = await Moment.findOrFail(params.id)
    const body = request.body()

    moment.title = body.title
    moment.description = body.description

    if (moment.image != body.image || !moment.image) {
      const image = request.file('image', this.optionsValidator)
      if (image) {
        const imgName = `${uuidv4()}.${image.extname}`

        await image.move(Application.tmpPath('uploads'), {
          name: imgName
        })

        moment.image = imgName
      }
    }

    return {
      message: "Momento actualizado com sucesso",
      data: moment
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)
    await moment.delete()
    return {
      message: "Momento eliminado com sucesso",
      data: moment
    }
  }
}
