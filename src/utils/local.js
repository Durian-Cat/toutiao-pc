const KEY = 'toutiao-pc'
const local = {
  setUser (user) {
    var subStr = JSON.stringify(user)
    window.sessionStorage.setItem(KEY, subStr)
  },
  getUser () {
    var str = window.sessionStorage.getItem(KEY)
    return JSON.parse(str)
  },
  removeUser () {
    window.sessionStorage.removeItem(KEY)
  }
}
export default local
