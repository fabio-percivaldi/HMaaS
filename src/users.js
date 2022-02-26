'use strict'


const calculateUsers = (users) => {
  const separatedUsers = {}
  users.split(',').forEach(user => {
    const splittedUser = user.split(':')
    // eslint-disable-next-line prefer-destructuring
    separatedUsers[splittedUser[0]] = splittedUser[1]
  })
  return separatedUsers
}

module.exports = {
  calculateUsers,
}
