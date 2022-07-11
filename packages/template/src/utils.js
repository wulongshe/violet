import dayjs from 'dayjs'

export const typeOf = (target) => Object.prototype.toString.call(target).toLocaleLowerCase().slice(8, -1)

export const formatDate = (date, format = `YYYY-MM-DD HH:mm:ss`) => dayjs(date).format(format)

console.log(`[utils] init`)
