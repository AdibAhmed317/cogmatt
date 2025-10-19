// User service - handles fetching and processing user data
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserListOptions {
  limit?: number;
}

export async function fetchAllUsers(
  options?: UserListOptions
): Promise<User[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  const users = (await res.json()) as Array<any>;

  // Apply limit if provided
  let list = users;
  if (options?.limit !== undefined) {
    const limit = Math.max(0, Math.min(users.length, options.limit));
    list = users.slice(0, limit);
  }

  // Map to trimmed User shape
  return list.map((u) => ({ id: u.id, name: u.name, email: u.email }));
}

export async function fetchUserById(id: string): Promise<User> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) {
    throw new Error('User not found');
  }

  const u = await res.json();
  return { id: u.id, name: u.name, email: u.email };
}

export async function getUserStats() {
  const users = await fetchAllUsers();
  return {
    totalUsers: users.length,
    sample: users.slice(0, 3),
  };
}
