
const getAllUsers = (): Array<{ id: number, username: string }> => {
  const result = [{ id: 1, username: 'user1' }, { id: 2, username: 'user2' }]
  return (result)
}

export default {
  getAllUsers
}
