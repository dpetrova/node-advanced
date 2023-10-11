fetch("api/blogs", {
  method: "POST",
  credentials: "same-origin", //credentials will be sent only when sent to the same origin URL (other options: include/omit)
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ title: "Title", content: "Content" }),
}).then((res) => res.json());
