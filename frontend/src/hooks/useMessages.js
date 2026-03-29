import { useApi } from './useApi';
import * as messageService from '../services/messageService';

export const useMessages = () => {
  return useApi(messageService.getMessages);
};
