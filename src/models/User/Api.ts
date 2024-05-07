import { User } from "@/models/User/User"
import { Axios } from "../../api/Axios"
import { StoreInstance } from "@/models/Store"

export const fromProps = (props: User) => {
  const user = new User(props.username, props._id, props.blocked, props.isAdmin, props.date_registered, props.email)
  return user
}

export const getUser = async () => {
  const props: User = (await Axios.get('/user')).data
  return fromProps(props)
}


type UserCreateDTO = {
  username: string
  password: string
  email?: string
}
export const createUser = async (user: UserCreateDTO) => {
  const res: User = (await Axios.post('/user', user)).data
  return fromProps(res)
}

export const login = async (user: UserCreateDTO) => {
  const token:{access_token: string}=(await Axios.post('/user/login', user)).data
  localStorage.setItem('access_token', token.access_token)
  const Usr = await getUser()
  StoreInstance.user = Usr
}

export const deleteUser = async () => {
  await Axios.delete('/user')
}

export const updateUser = async (user: Partial<UserCreateDTO>) => {
  const res: User = (await Axios.patch('/user', user)).data
  return fromProps(res)
}

export const logOut = () => {
  // Call API to update user
  localStorage.removeItem('access_token')
  delete StoreInstance.user
  close()
};