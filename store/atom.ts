import { ReceivedMessage } from '@/interfaces/IMqtt'
import {atom, useAtom}from 'jotai'



export const mqqtMessageAtom = atom<ReceivedMessage[]>([]);
export const useMqqtMessageAtom = (p0: (prev: ReceivedMessage[]) => ReceivedMessage[]) => useAtom(mqqtMessageAtom);