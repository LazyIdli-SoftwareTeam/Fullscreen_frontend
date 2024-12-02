import axios from "axios";
// const BASE_URL = "https://backend.projectteho.com/api";
const BASE_URL = 'http://localhost:8000/api'

let Response = {
  status: 0,
  msg: "",
};

export const postRequest = async ({
  endpoint,
  data = {},
  headers = {},
  dispatch = null,
  controller,
}) => {
  const urlParameters = new URLSearchParams(window.location.search);
  const branchId = urlParameters.get("branchid");
  console.log(branchId);

  let response = { ...Response };
  try {
    const res = await axios.post(
      `${BASE_URL}${endpoint}`,
      { ...data, centerId: branchId },
      {
        headers: headers,
      },
      {
        signal: controller.signal,
      }
    );
    response = {
      status: res.status,
      msg: res.data,
    };
  } catch (e) {
    response = {
      status: e.response.status,
      msg: e.response.data,
    };
    return response;
  } finally {
    return response;
  }
};

export const getRequest = async ({
  endpoint,
  params = {},
  headers = {},
  dispatch = null,
  controller,
}) => {
  let response = { ...Response };
  try {
    const res = await axios.get(
      `${BASE_URL}${endpoint}`,
      {
        params: params,
        headers: headers,
      },
      {
        signal: controller.signal,
      }
    );
    response = {
      status: res.status,
      msg: res.data,
    };
  } catch (e) {
    console.log(e);
    return e;
  } finally {
    return response;
  }
};
