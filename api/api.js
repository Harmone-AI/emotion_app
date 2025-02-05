async function http(url, params, method) {
  let data = {
    method: method || "post",
  };
  if (!method || method == "post") {
    data.body = JSON.stringify(params);
    data.header = {
      "Content-Type": "application/json",
    };
  }
  let res = await fetch("https://harmone.ai/new/api" + url, data).then(
    function (response) {
      //response.status表示响应的http状态码
      console.log("response", response);
      if (response.status === 200) {
        //json是返回的response提供的一个方法,会把返回的json字符串反序列化成对象,也被包装成一个Promise了
        return response.json();
      } else {
        return {};
      }
    }
  );
  // console.log('data', res);
  return res;
}

export async function word2tasklist(params) {
  let res = await http("/word2tasklist", params);
  return res;
}

export async function add_task(params) {
  let res = await http("/add_task", params);
  return res;
}
export async function current_tasklist(userid) {
  let res = await http("/current_tasklist/" + userid, {}, "get");
  return res;
}
