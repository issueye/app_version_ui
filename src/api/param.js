import request from '../utils/request.js'

export const apiParamList = (params) => {
    return request({
        url: 'api/v1/param',
        method: 'get',
        params: params,
    })
}

export const apiParamModify = (params) => {
    return request({
        url: 'api/v1/param',
        method: 'put',
        params: params,
    })
}