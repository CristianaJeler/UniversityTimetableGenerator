export const baseUrl = 'localhost:8080/timetable';

export const getLogger: (tag: string) => (...args: any) => void =
    tag => (...args) => console.log(tag, ...args);

const log = getLogger('api');

export interface ResponseProps<T> {
    data: T;
    status: number;
}

export function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T> {
    log(`${fnName} - started`);
    return promise
        .then(res => {
            log(`${fnName} - succeeded`);
            log(res.data)
            return Promise.resolve(res.data);
        })
        .catch(err => {
            log(`${fnName} - failed`);
            log(err)
            return Promise.reject(err);
        })
}

export const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

export const authorizationConfig = (token?: string) => ({
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }
});
export const pictureUpdateConfig = (token?: string) => ({
    headers: {
        'Content-Type': 'multipart/form-data;',
        Authorization: `Bearer ${token}`,
    }
});
