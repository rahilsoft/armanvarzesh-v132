
import { useQuery, useMutation } from "@apollo/client";
import { GET_PAYMENTS } from "@graphql/queries/payment.queries";
import { CREATE_PAYMENT } from "@graphql/mutations/payment.mutations";

export function usePayment() {
  const { data, loading } = useQuery(GET_PAYMENTS);
  const [createPayment] = useMutation(CREATE_PAYMENT);

  return {
    payments: data?.payments || [],
    loading,
    createPayment: (input) => createPayment({ variables: { input } })
  };
}
