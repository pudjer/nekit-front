import { User } from "@/models/User"
import { Axios } from "../Axios"



export const getUser = async () => {
  const user: User = (await Axios.get('/user')).data
  return user
}


type UserCreateDTO = {
  username: string
  password: string
  email?: string
}
export const createUser = async (user: UserCreateDTO) => {
  const res: User = (await Axios.post('/user', user)).data
  return res
}

export const login = async (user: UserCreateDTO) => {
  await Axios.post('/user/login', user)
}

export const deleteUser = async () => {
  await Axios.delete('/user')
}

export const updateUser = async (user: Partial<UserCreateDTO>) => {
  const res: User = (await Axios.patch('/user', user)).data
  return res
}