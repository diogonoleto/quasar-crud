import { firestoreAction } from 'vuexfire'
import { update, getByAttr, create } from 'src/services/firebase/db.js'
import Interest from 'src/models/Interest'

export const interestList = firestoreAction(({ bindFirestoreRef }) => {
    return bindFirestoreRef('list', getByAttr('interests', { deleted_at: null }))
})
export const interestCreateOrUpdate = async (state, payload) => {
    if (payload.id) {
        return update('interests', payload)
    } else {
        let p = new Interest(payload)
        return create('interests', { p: p })
    }
}
export const interestDelete = (state, payload) => {
    payload.deleted_at = new Date()
    return update('interests', payload)
}