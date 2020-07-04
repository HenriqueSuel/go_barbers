import { Request, Response } from 'express'
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/users/services/updateUserAvatarService';


export default class UserAvatarController {
  public async Update(request: Request, response: Response):Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename
    });
    response.json(user)
    return response.json({ ok: true })
  }

}
