import { Category } from "./types/types";
import Api from "./api";

export const getCats = async (): Promise<Category[]> => {
  return Api.get('/cat')
    .then(response => response.data)
    .catch(error => {
      console.log(error.response.data);
    });
};
