import request from '../utils/request.js'

export const apiLogin = (data) => {
    return request({
        url: 'api/v1/login',
        method: 'post',
        data: data,
    })
}