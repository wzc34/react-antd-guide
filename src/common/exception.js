export const error = (err_msg, err) => {
    if(err && err.type === 'http'){
        return err;
    }
    let error = new Error(err_msg);
    error.res = err_msg;
    error.type = 'error';
    return error;
}

export const warn = warn_msg => {
    let error = new Error(warn_msg);
    error.res = warn_msg;
    error.type = 'warn';
    return error;
}

export const info = info_msg => {
    let error = new Error(info_msg);
    error.res = info_msg;
    error.type = 'info';
    return error;
}