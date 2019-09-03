export default {
  get host() {
    return 'smtp.exmail.qq.com'
  },
  get port() {
    return 465
  },
  get user() {
    return 'tech@csthink.com'
  },
  get pass() {
    return ''
  },
  get code() {
    return () => {
      return Math.random()
        .toString(16)
        .slice(2, 6)
        .toUpperCase()
    }
  },
  get expire() {
    return () => {
      return new Date().getTime() + 60000
    }
  }
}
