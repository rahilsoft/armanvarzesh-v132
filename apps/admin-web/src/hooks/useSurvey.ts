
import { useQuery, useMutation } from "@apollo/client";
import { GET_SURVEYS } from "@graphql/queries/survey.queries";
import { CREATE_SURVEY } from "@graphql/mutations/survey.mutations";

export function useSurvey() {
  const { data, loading } = useQuery(GET_SURVEYS);
  const [createSurvey] = useMutation(CREATE_SURVEY);

  return {
    surveys: data?.surveys || [],
    loading,
    createSurvey: (input) => createSurvey({ variables: { input } })
  };
}
