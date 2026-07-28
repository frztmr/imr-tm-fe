// Mocked account context. Replace with real auth later.
export const currentUser = {
  name: "Andre Wijaya",
  email: "andre.wijaya@imrc.example",
  role: "Field Researcher",
};

export function useCurrentUser() {
  return currentUser;
}