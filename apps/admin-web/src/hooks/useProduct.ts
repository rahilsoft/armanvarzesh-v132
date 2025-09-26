
import { useQuery, useMutation } from "@apollo/client";
import { GET_PRODUCTS } from "@graphql/queries/product.queries";
import { CREATE_PRODUCT } from "@graphql/mutations/product.mutations";

export function useProduct() {
  const { data, loading } = useQuery(GET_PRODUCTS);
  const [createProduct] = useMutation(CREATE_PRODUCT);

  return {
    products: data?.products || [],
    loading,
    createProduct: (input) => createProduct({ variables: { input } })
  };
}
