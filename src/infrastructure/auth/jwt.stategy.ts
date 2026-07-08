import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Env } from '@src/env/env-schema'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

const JwtPayloadSchema = z.object({
  sub: z.uuid(),
  email: z.email(),
})

/**
 * Payload esperado dentro do JWT.
 *
 * Este tipo representa os dados brutos transportados pelo token,
 * antes de serem convertidos para o formato usado internamente pela aplicação.
 */
export type JwtPayload = z.infer<typeof JwtPayloadSchema>

/**
 * Usuário autenticado anexado ao request pelo Passport.
 *
 * O retorno do método `validate()` fica disponível em `request.user`
 * nas rotas protegidas por JWT.
 */
export type AuthenticatedUser = {
  userId: string
  email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY_PATH', { infer: true })

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    })
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const validatedPayload = JwtPayloadSchema.parse(payload)

    return {
      userId: validatedPayload.sub,
      email: validatedPayload.email,
    }
  }
}
