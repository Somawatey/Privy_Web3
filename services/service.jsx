import axios from 'axios';

axios.defaults.headers.common.Accept = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
export async function getData(url) {
  return await axios
    .get(`${url}`)
    .then(({ data }) => {
      return data;
    })
    .catch(function (error) {
      console.log('There has been a problem with your fetch operation: ' + error);
      // throw error;
      return error;
    });
}
export async function postData(url, body) {
  return await axios
    .post(`${url}`, body)
    .then(({ data }) => data)
    .catch((err) => {
      console.log('postData with file error:', err);
    });
}
export async function postDataWithFile(url, body) {
  console.log(url, body, 'Uplaod with file');
  axios.defaults.headers.common.Accept = 'application/json';
  axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
  return await axios
    .post(`${url}`, body)
    .then(({ data }) => data)
    .catch((err) => {
      console.log('Uplaod with file error:', err);
    });
}
export async function uploadFileData(url, body) {
  axios.defaults.headers.common.Accept = 'application/json';
  axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
  return await axios
    // eslint-disable-next-line no-undef
    .post(`${url}`, body, config)
    .then(({ data }) => data)
    .catch((err) => {
      console.log('Uplaod error:', err);
    });
}
export async function updateData(url, body) {
  return await axios.put(`${url}`, body).then(({ data }) => data);
}
export async function deleteData(url) {
  return await axios.delete(`${url}`).then(({ data }) => data);
}
