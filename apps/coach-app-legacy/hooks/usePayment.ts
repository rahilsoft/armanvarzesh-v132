
import { useQuery } from "@apollo/client";
import { GET_PAYMENTS } from "@graphql/queries/payment.queries";

export function usePayment() {
  const { data, loading } = useQuery(GET_PAYMENTS);
  return {
    payments: data?.payments || [],
    loading
  };
}
