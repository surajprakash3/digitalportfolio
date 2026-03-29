import { useApi } from './useApi';
import * as blogService from '../services/blogService';

export const usePublishedBlogPosts = (params) => {
  return useApi(blogService.getPublishedPosts, [params]);
};

export const useAllBlogPosts = () => {
  return useApi(blogService.getAllBlogPosts);
};

export const useBlogPost = (slug) => {
  return useApi(blogService.getPostBySlug, [slug]);
};
