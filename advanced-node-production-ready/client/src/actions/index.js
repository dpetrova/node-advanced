import axios from "axios";
import { FETCH_USER, FETCH_BLOGS, FETCH_BLOG } from "./types";

export const fetchUser = () => async (dispatch) => {
  const res = await axios.get("/api/current_user");

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = (token) => async (dispatch) => {
  const res = await axios.post("/api/stripe", token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitBlog = (values, file, history) => async (dispatch) => {
  // GET request to API to request a presigned URL
  const presignedUrl = await axios.get("/api/upload");

  // use the presigned URL to upload the file to AWS S3
  await axios.put(presignedUrl.data.url, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  // POST request to API to create a blog post
  const res = await axios.post("/api/blogs", {
    ...values,
    imageUrl: presignedUrl.data.key, // file name and folder in AWS bucket
  });

  // navigate user back to the list of blogs
  history.push("/blogs");

  // tell the Redux side of the app about the new blog post that was created
  dispatch({ type: FETCH_BLOG, payload: res.data });
};

export const fetchBlogs = () => async (dispatch) => {
  const res = await axios.get("/api/blogs");

  dispatch({ type: FETCH_BLOGS, payload: res.data });
};

export const fetchBlog = (id) => async (dispatch) => {
  const res = await axios.get(`/api/blogs/${id}`);

  dispatch({ type: FETCH_BLOG, payload: res.data });
};
