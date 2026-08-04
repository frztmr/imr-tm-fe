// Mocked account context. Replace with real auth later.
export const currentUser = {
  name: "Fariz Tamara",
  email: "muhammad.fariz@icbp.indofood.co.id",
  role: "Field Researcher",
};

export function useCurrentUser() {
  return currentUser;
}