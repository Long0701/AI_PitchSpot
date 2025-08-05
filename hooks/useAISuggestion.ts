import useSWRMutation from "swr/mutation";

export const useAISuggestion = () => {
  const { trigger, data, isMutating, error } = useSWRMutation(
    "/api/ai/analyze",
    async (url, { arg }: { arg: { prompt: string } }) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg),
      });
      const json = await res.json();
      return json.data;
    }
  );

  return {
    getSuggestion: trigger,
    suggestion: data,
    loading: isMutating,
    error,
  };
};