
import { useQuery, useMutation } from "@apollo/client";
import { GET_NOTIFICATIONS } from "@graphql/queries/notification.queries";
import { CREATE_NOTIFICATION } from "@graphql/mutations/notification.mutations";

export function useNotification(userId: number) {
  const { data, loading } = useQuery(GET_NOTIFICATIONS, { variables: { userId } });
  const [createNotification] = useMutation(CREATE_NOTIFICATION);

  return {
    notifications: data?.notifications || [],
    loading,
    createNotification: (input) => createNotification({ variables: { userId, input } })
  };
}
