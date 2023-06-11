import axios from 'axios';
import { ElMessage } from 'element-plus'

const service = axios.create({
    timeout: 5000
});

service.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = token;
        }

        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response) => {
        if (response.status === 200) {
            return response;
        } else {
            Promise.reject();
        }
    },
    (error) => {
        // 拦截处理错误情况
        console.log('response', error);
        if (error.code == "ERR_BAD_REQUEST") {
            ElMessage({
                type: 'error',
                message: error.response.data.message,
            })
        }

        return Promise.reject();
    }
);

export default service;
