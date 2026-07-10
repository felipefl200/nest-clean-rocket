import { type Answer as PrismaAnswer, Prisma } from '@/prisma/generated'
import { UniqueEntityID } from '@/src/core/entities/unique-entity-id'
import { Answer } from '@/src/domain/forum/enterprise/entities/answer'

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create(
      {
        content: raw.content,
        questionId: new UniqueEntityID(raw.questionId),
        authorId: new UniqueEntityID(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      questionId: answer.questionId.toString(),
      authorId: answer.authorId.toValue(),
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt ?? null,
    }
  }
}
