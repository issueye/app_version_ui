import request from '../utils/request.js'

// 查询
export const apiMonitorList = (params) => {
    return request({
        url: 'api/v1/monitor',
        method: 'get',
        params: params,
    })
}

// 添加
export const apiMonitorAdd = (data) => {
    return request({
        url: 'api/v1/monitor',
        method: 'post',
        data: data,
    })
}

// 修改
export const apiMonitorModify = (data) => {
    return request({
        url: 'api/v1/monitor',
        method: 'put',
        data: data,
    })
}

// 删除
export const apiMonitorDel = (id) => {
    return request({
        url: `api/v1/monitor/${id}`,
        method: 'delete',
    })
}

// 修改状态
export const apiMonitorModifyState = (id) => {
    return request({
        url: `api/v1/monitor/state/${id}`,
        method: 'put',
    })
}