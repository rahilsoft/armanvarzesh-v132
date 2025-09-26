
import { useQuery, useMutation } from "@apollo/client";
import { GET_NOTIFICATIONS } from "@graphql/queries/notification.queries";
import { SEND_NOTIFICATION } from "@graphql/mutations/notification.mutations";

export function useNotification() {
  const { data, loading } = useQuery(GET_NOTIFICATIONS);
  const [sendNotification] = useMutation(SEND_NOTIFICATION);

  return {
    notifications: data?.notifications || [],
    loading,
    sendNotification: (input) => sendNotification({ variables: { input } })
  };
}
