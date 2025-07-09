import { useQuery } from "@tanstack/react-query"
import { axiosInstanace } from "../utils/axiosInstance"

export const useAuthUser = () =>{
    const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const {data} =  await axiosInstanace.get('/auth/me')
      return data
    },
    retry: false
  })

  return {isLoading: authUser.isLoading, authUser: authUser.data?.user}
}