import bus from "./bus"

const handleResponse = async (response) => {
  if (
    (response.status > 299 && response.status < 422) ||
    response.status > 422
  ) {
    const text = await response.text()
    bus.emit("error", text)
    throw new Error(text)
  } else if (response.status === 422) {
    const data = await response.json()
    bus.emit(
      "error",
      data.map((d) => d.message)
    )
    throw new Error(JSON.stringify(data))
  }

  try {
    const json = await response.json()
    return json
  } catch (e) {
    console.warn(e)
    return null
  }
}

export const post = (url, data = {}) => {
  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify(data)
  }).then(handleResponse)
}

export const get = (url) => {
  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8"
    }
  }).then(handleResponse)
}
