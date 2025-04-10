import { connDb } from '~/server/services/connDb'
import Participant from '~/server/schemas/participantSchema'

export default defineEventHandler(async (event) => {
  await connDb()

  const body = await readBody(event)
  const { studyId, answers, demographic } = body

  if (!studyId || !answers) {
    return { status: 'error', message: 'Missing studyId or answers' }
  }

  const newParticipant = await Participant.create({
    study: studyId,
    answers,
    demographic,
    status: 'complete'
  })

  return { insertedId: newParticipant._id }
})
