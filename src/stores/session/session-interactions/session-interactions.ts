import { makeAutoObservable } from 'mobx'
import { mobxState } from 'mobx-toolbox'
import { GetSessionsResponse } from '../session-actions/types'

class SessionInteractionsStore {
	constructor() { makeAutoObservable(this) }

	selectedSession = mobxState<null | GetSessionsResponse>(null)("selectedSession")

	// BOTTOM SHEET

	sessionSheet = mobxState(false)("sessionSheet")
	sessionSheetOnCloseSignal = mobxState(false)("sessionSheetOnCloseSignal")

}

export const sessionInteractionsStore = new SessionInteractionsStore()