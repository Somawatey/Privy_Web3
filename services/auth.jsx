import { API_URL } from './config';
import * as API_SERVICE from './service';

const userLogin = async (body) => {
  const response = await API_SERVICE.postData(`${API_URL}/login`, body);
  return response;
};

const userRegister = async (body) => {
    const response = await API_SERVICE.postData(`${API_URL}/register`, body);
    return response;
};

export {
    userLogin,
    userRegister
};
