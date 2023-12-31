import request from '../utils/request.js'

// 查询
export const apiRepoList = (params) => {
    return request({
        url: 'api/v1/repo',
        method: 'get',
        params: params,
    })
}

// 查询单条
export const apiRepoGetById = (id) => {
    return request({
        url: `api/v1/repo/${id}`,
        method: 'get',
    })
}

// 添加
export const apiRepoCreate = (data) => {
    return request({
        url: 'api/v1/repo',
        method: 'post',
        data: data,
    })
}

// 修改
export const apiRepoModify = (data) => {
    return request({
        url: 'api/v1/repo',
        method: 'put',
        data: data,
    })
}

// 修改代码
export const apiRepoModifyCode = (data) => {
    return request({
        url: 'api/v1/repo/code',
        method: 'put',
        data: data,
    })
}

// 修改代码
export const apiRepoTestRun = (data) => {
    return request({
        url: 'api/v1/repo/testRun',
        method: 'put',
        data: data,
    })
}

// 删除
export const apiRepoDel = (id) => {
    return request({
        url: `api/v1/repo/${id}`,
        method: 'delete',
    })
}

// 获取分支列表
export const apiBranchList = (id) => {
    return request({
        url: `api/v1/repo/branch/${id}`,
        method: 'get',
    })
}

// 刷新分支列表
export const apiBranchRefresh = (id) => {
    return request({
        url: `api/v1/repo/branch/refresh/${id}`,
        method: 'get',
    })
}

// 获取最后一次版本信息
export const apiLastVerNum = (id, params) => {
    return request({
        url: `api/v1/repo/version/lastVerNum/${id}`,
        method: 'get',
        params: params
    })
}


// 添加版本
export const apiVersionCreate = (data) => {
    return request({
        url: 'api/v1/repo/version',
        method: 'post',
        data: data,
    })
}

// 获取版本列表
export const apiVersionList = (params) => {
    return request({
        url: 'api/v1/repo/version',
        method: 'get',
        params: params,
    })
}

// 移除版本
export const apiVersionRemove = (id) => {
    return request({
        url: `api/v1/repo/version/${id}`,
        method: 'delete',
    })
}

// 编译版本
export const apiVersionBuild = (id) => {
    return request({
        url: `api/v1/repo/version/build/${id}`,
        method: 'get',
    })
}


// 编译版本
export const apiVersionReleaseList = (params) => {
    return request({
        url: `api/v1/repo/version/release`,
        method: 'get',
        params: params,
    })
}

// 编译版本
export const apiVersionReleaseDelete = (id) => {
    return request({
        url: `api/v1/repo/version/release/${id}`,
        method: 'delete',
    })
}

// 下载程序
export const apiVersionReleaseDownload = (id) => {
    return request({
        url: `api/v1/repo/version/release/download/${id}`,
        method: 'get',
        responseType: 'blob',
    })
}