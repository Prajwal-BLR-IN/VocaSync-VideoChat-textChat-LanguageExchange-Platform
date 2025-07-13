import { useQuery } from "@tanstack/react-query"
import { axiosInstanace } from "../utils/axiosInstance"

export const useAuthUser = () =>{
    const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const {data} =  await axiosInstanace.get('/auth/me')
        return data
      } catch (error) {
        console.log("Error in UseAuthUser", error);
        return null;
      }
    },
    retry: false
  })

  return {isLoading: authUser.isLoading, authUser: authUser.data?.user}
}