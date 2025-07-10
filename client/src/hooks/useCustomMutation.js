import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstanace } from '../utils/axiosInstance';
import toast from 'react-hot-toast';

/**
 * A reusable POST mutation hook with toast, error handling, and query invalidation.
 *
 * @param {Object} options
 * @param {string} options.url - The API endpoint to post to.
 * @param {Function} [options.onSuccessRedirect] - Function to run after success (e.g., navigate).
 * @param {string} [options.invalidateKey] - Query key to invalidate on success.
 * @returns useMutation object
 */
export const useCustomMutation = ({ url, onSuccessRedirect, invalidateKey }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstanace.post(url, payload);
      if (data.success) {
        toast.success(data.message);
        return data;
      } else {
        throw new Error(data.message || "Request failed");
      }
    },

    onSuccess: () => {
      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: [invalidateKey] });
      }
      // 🔁 Wait until authUser updates, then redirect
      setTimeout(() => {
        if (onSuccessRedirect) onSuccessRedirect();
      }, 300); // just enough time for query to update state
    },

    onError: (error) => {
      const backendMessage = error?.response?.data?.message || error.message || "Something went wrong";
      toast.error(backendMessage);
    }
  });
};
